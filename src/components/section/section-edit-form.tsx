import { z } from "zod";
import { useAtom } from "jotai";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { SectionType } from "@prisma/client";
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

const sectionUpdationSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Section name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof sectionUpdationSchema>;

interface CreateSectionFormProps {
  closeModal: () => void;
  sectionId: string;
  sectionName: string;
  sectionType: SectionType;
}

export const SectionEditForm: React.FC<CreateSectionFormProps> = ({
  closeModal,
  sectionId,
  sectionName,
  sectionType,
}) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(sectionUpdationSchema),
    defaultValues: {
      name: sectionName,
    },
  });

  const { mutate: updateSection, isLoading } =
    trpc.section.updateSection.useMutation({
      onSuccess: (_, { name }) => {
        closeModal();
        handleOptimisticUpdate(name ?? "");
      },
    });

  const handleOptimisticUpdate = (updatedName: string) => {
    if (sectionType === "CREATION") {
      setCreatedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);

        if (index !== -1) {
          const updatedSections = [...prev];

          updatedSections[index] = {
            ...updatedSections[index],
            name: updatedName,
          };

          return updatedSections;
        }

        return prev;
      });
    } else {
      setJoinedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);

        if (index !== -1) {
          const updatedSections = [...prev];

          updatedSections[index] = {
            ...updatedSections[index],
            name: updatedName,
          };

          return updatedSections;
        }

        return prev;
      });
    }
  };

  function handleEditSection(data: Inputs) {
    updateSection({
      sectionId,
      name: data.name,
    });
  }

  function onSubmit(data: Inputs) {
    handleEditSection(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="section-edit-form"
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
                    placeholder="E.g: First Semester"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        className="my-1 w-full"
        form="section-edit-form"
        disabled={isLoading}
      >
        {isLoading && (
          <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Edit
        <span className="sr-only">Edit Section</span>
      </Button>
    </div>
  );
};
