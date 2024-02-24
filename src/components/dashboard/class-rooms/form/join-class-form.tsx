import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  classCode: z
    .string()
    .min(6, { message: "The code must consist of 6 alphanumeric characters." })
    .max(6, { message: "The code must consist of 6 alphanumeric characters." })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "The code must be alphanumeric.",
    })
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Class code cannot be empty" }
    ),
});

type Inputs = z.infer<typeof classCreationSchema>;

export const JoinClassForm = ({ sectionId }: { sectionId: string }) => {
  const router = useRouter();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(classCreationSchema),
    defaultValues: {
      classCode: "",
    },
  });

  const { mutate: joinClass, isLoading } = trpc.class.joinClass.useMutation({
    onSuccess: (classRoom) => {
      toast.success("You are now a member of this class");
      router.push(`/c/${classRoom.id}`);
    },
    onMutate: () => {
      toast.loading("Just a moment...", { duration: 1000 });
    },
  });

  function handleJoinClass(data: Inputs) {
    joinClass({
      classCode: data.classCode,
      sectionId,
    });
  }

  function onSubmit(data: Inputs) {
    handleJoinClass(data);
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
            name="classCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Code</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="E.g: ABC123" {...field} />
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
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Join Class"
        )}
        <span className="sr-only">Join Class</span>
      </Button>
    </div>
  );
};
