import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
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

const classCreationSchema = z.object({
  title: z
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

type Inputs = z.infer<typeof classCreationSchema>;

export const CreateClassForm = () => {
  const router = useRouter();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(classCreationSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createClass, isLoading } = trpc.class.createClass.useMutation(
    {
      onSuccess: (classRoom) => {
        toast.success("Class created successfully");
        router.push(`/class/${classRoom.id}`);
      },
    }
  );

  function handleCreateClass(data: Inputs) {
    createClass({
      title: data.title,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateClass(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="class-creation-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="title"
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
      <Button
        className="my-1 w-full"
        form="class-creation-form"
        disabled={isLoading}
      >
        {isLoading && (
          <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Create Class
        <span className="sr-only">Create Class</span>
      </Button>
    </div>
  );
};
