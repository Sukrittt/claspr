import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditClassDescription } from "@/hooks/class";

const classCreationSchema = z.object({
  description: z
    .string()
    .min(3)
    .max(200)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Class description cannot be empty" }
    ),
});

type Inputs = z.infer<typeof classCreationSchema>;

export const AddDescriptionForm = ({
  classroomId,
  closeModal,
  description,
}: {
  classroomId: string;
  description?: string;
  closeModal: () => void;
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(classCreationSchema),
    defaultValues: {
      description: description ?? "",
    },
  });

  const { mutate: addDescription } = useEditClassDescription({ closeModal });

  function handleAddDescription(data: Inputs) {
    addDescription({
      classroomId,
      description: data.description,
    });
  }

  function onSubmit(data: Inputs) {
    handleAddDescription(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="add-description-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.g: This class delves into the world of data structures."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="my-1 w-full" form="add-description-form">
        Save
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
