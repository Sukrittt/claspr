import { z } from "zod";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { ArrowUpFromDot, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExtendedAssignment } from "@/types";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/hooks/comment";
import { UserAvatar } from "@/components/custom/user-avatar";

const commentCreationSchema = z.object({
  message: z
    .string()
    .min(1)
    .max(80)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Comment cannot be empty" }
    ),
});

type Inputs = z.infer<typeof commentCreationSchema>;

interface CommentInputProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  assignment,
  session,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(commentCreationSchema),
    defaultValues: {
      message: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const { mutate: createComment, isLoading } = useCreateComment({ resetForm });

  function handleCreateComment(data: Inputs) {
    createComment({
      ...data,
      assignmentId: assignment.id,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateComment(data);
  }

  const disabled = isLoading || form.getValues("message").length === 0;

  return (
    <Form {...form}>
      <form
        id="comment-creation-form"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="w-full"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <div className="flex items-center gap-x-2 relative">
                  <UserAvatar
                    user={session.user}
                    className="h-5 w-5 cursor-default"
                  />
                  <Input
                    type="text"
                    className="h-7 text-xs focus-visible:ring-0 w-full pr-7"
                    disabled={isLoading}
                    autoComplete="off"
                    placeholder="Leave a comment..."
                    {...field}
                  />

                  <div className="absolute right-1">
                    <Button
                      form="comment-creation-form"
                      className="h-[22px] w-[22px]"
                      disabled={disabled}
                      size="icon"
                      variant="ghost"
                    >
                      {isLoading ? (
                        <Loader className="h-3 w-3 text-muted-foreground animate-spin" />
                      ) : (
                        <ArrowUpFromDot className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
