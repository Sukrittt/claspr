import { z } from "zod";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
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
import {
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";

const sectionCreationSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Section name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof sectionCreationSchema>;

interface CreateSectionFormProps {
  closeModal: () => void;
  sectionType: SectionType;
}

export const CreateSectionForm: React.FC<CreateSectionFormProps> = ({
  closeModal,
  sectionType,
}) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(sectionCreationSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createSection, isLoading } =
    trpc.section.createSection.useMutation({
      onSuccess: (section) => {
        closeModal();

        if (sectionType === "CREATION") {
          setCreatedClassSections((prev) => [
            section as ExtendedSectionWithClassrooms,
            ...prev,
          ]);
        } else {
          setJoinedClassSections((prev) => [
            section as ExtendedSectionWithMemberships,
            ...prev,
          ]);
        }
      },
    });

  function handleCreateSection(data: Inputs) {
    createSection({
      name: data.name,
      sectionType,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateSection(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="section-creation-form"
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
        form="section-creation-form"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Create Section"
        )}
        <span className="sr-only">Create Section</span>
      </Button>
    </div>
  );
};
