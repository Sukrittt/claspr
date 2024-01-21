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
import { createdClassSections } from "@/atoms";

const sectionUpdationSchema = z.object({
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

type Inputs = z.infer<typeof sectionUpdationSchema>;

interface EditClassFormProps {
  closeModal: () => void;
  sectionId: string;
  classroomId: string;
  classroomName: string;
}

export const ClassEditForm: React.FC<EditClassFormProps> = ({
  closeModal,
  sectionId,
  classroomId,
  classroomName,
}) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(sectionUpdationSchema),
    defaultValues: {
      name: classroomName,
    },
  });

  const { mutate: renameClass } = trpc.class.renameClass.useMutation({
    onMutate: ({ title }) => {
      closeModal();
      handleOptimisticUpdate(title);
    },
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  const handleOptimisticUpdate = (updatedName: string) => {
    setCreatedClassSections((prev) => {
      const currentSection = [...prev];

      const sectionToUpdate = currentSection.find((s) => s.id === sectionId);
      if (!sectionToUpdate) return currentSection;

      const classroomToUpdate = sectionToUpdate.classrooms.find(
        (c) => c.id === classroomId
      );
      if (!classroomToUpdate) return currentSection;

      classroomToUpdate.title = updatedName;

      const classroomIndex = sectionToUpdate.classrooms.findIndex(
        (c) => c.id === classroomId
      );
      sectionToUpdate.classrooms[classroomIndex] = classroomToUpdate;

      const sectionIndex = currentSection.findIndex((s) => s.id === sectionId);
      currentSection[sectionIndex] = sectionToUpdate;

      return currentSection;
    });
  };

  function handleEditClass(data: Inputs) {
    renameClass({
      classroomId,
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
          id="class-rename-form"
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
      <Button className="my-1 w-full" form="class-rename-form">
        Edit
        <span className="sr-only">Edit Section</span>
      </Button>
    </div>
  );
};
