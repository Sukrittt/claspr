import { z } from "zod";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createdClassSections, joinedClassSections } from "@/atoms";

const classUpdationSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Class name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof classUpdationSchema>;

interface EditClassFormProps {
  closeModal: () => void;
  membershipId: string;
  classroomName: string;
  sectionId: string;
}

export const MemberEditForm: React.FC<EditClassFormProps> = ({
  closeModal,
  membershipId,
  classroomName,
  sectionId,
}) => {
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(classUpdationSchema),
    defaultValues: {
      name: classroomName,
    },
  });

  const { mutate: renameClass } = trpc.class.setNickName.useMutation({
    onMutate: ({ title }) => {
      closeModal();
      handleOptimisticUpdate(title);
    },
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const handleOptimisticUpdate = (updatedName: string) => {
    setJoinedClassSections((prev) => {
      const currentSection = [...prev];

      const sectionToUpdate = currentSection.find((s) => s.id === sectionId);
      if (!sectionToUpdate) return currentSection;

      const membershipToUpdate = sectionToUpdate.memberships.find(
        (m) => m.id === membershipId
      );
      if (!membershipToUpdate) return currentSection;

      membershipToUpdate.renamedClassroom = updatedName;

      const classroomIndex = sectionToUpdate.memberships.findIndex(
        (m) => m.id === membershipId
      );
      sectionToUpdate.memberships[classroomIndex] = membershipToUpdate;

      const sectionIndex = currentSection.findIndex((s) => s.id === sectionId);
      currentSection[sectionIndex] = sectionToUpdate;

      return currentSection;
    });
  };

  function handleEditClass(data: Inputs) {
    renameClass({
      membershipId,
      title: data.name,
    });
  }

  function onSubmit(data: Inputs) {
    handleEditClass(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="member-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.g: Science Class"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="my-1 w-full" form="member-edit-form">
        Edit
        <span className="sr-only">Edit Class</span>
      </Button>
    </div>
  );
};
