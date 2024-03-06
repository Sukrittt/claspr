import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExtendedClassroomDetails } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditClassroom } from "@/hooks/class";
import { Textarea } from "@/components/ui/textarea";

interface ClassroomSettingsProps {
  classroom: ExtendedClassroomDetails;
}

const editClassroomSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Classroom name cannot be empty" }
    ),
  domain: z.string().max(100).nullable(),
  description: z.string().max(100).nullable(),
});

type Inputs = z.infer<typeof editClassroomSchema>;

export const ClassroomSettingsForm: React.FC<ClassroomSettingsProps> = ({
  classroom,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(editClassroomSchema),
    defaultValues: {
      title: classroom.title,
      description: classroom.description,
      domain: classroom.protectedDomain,
    },
  });

  const { mutate: editClassroom, isLoading } = useEditClassroom();

  function onSubmit(data: Inputs) {
    editClassroom({
      ...data,
      classroomId: classroom.id,
    });
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Form {...form}>
        <form
          id="classroom-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="E.g: Data Structures Assignment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              const { value: fieldValue, ...remainingFields } = field;
              const value = fieldValue ?? "";

              return (
                <FormItem className="space-y-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="E.g: This class delves into the world of data structures."
                      value={value}
                      {...remainingFields}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => {
              const { value: fieldValue, ...remainingFields } = field;
              const value = fieldValue ?? "";

              return (
                <FormItem className="space-y-1">
                  <FormLabel>Protected Domain</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="E.g: google.com"
                        value={value}
                        {...remainingFields}
                      />
                      <FormDescription className="text-xs">
                        Only users with this email domain are permitted to join
                        this classroom.
                      </FormDescription>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>

      <Button form="classroom-edit-form" className="w-fit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-3 w-[22px] animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
