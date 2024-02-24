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
import { ExtendedComment } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditComment } from "@/hooks/comment";

const commentUpdationSchema = z.object({
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

type Inputs = z.infer<typeof commentUpdationSchema>;

interface EditCommentFormProps {
  closeModal: () => void;
  comment: ExtendedComment;
}

export const CommentEditForm: React.FC<EditCommentFormProps> = ({
  closeModal,
  comment,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(commentUpdationSchema),
    defaultValues: {
      message: comment.message,
    },
  });

  const { mutate: editComment } = useEditComment({
    closeModal,
    assignmentId: comment.assignmentId,
  });

  function handleEditComment(data: Inputs) {
    editComment({
      commentId: comment.id,
      ...data,
    });
  }

  function onSubmit(data: Inputs) {
    handleEditComment(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="comment-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Leave a comment..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="my-1 w-full" form="comment-edit-form">
        Edit
        <span className="sr-only">Edit Comment</span>
      </Button>
    </div>
  );
};
