import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { DiscussionType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditReply } from "@/hooks/reply";

const replyEditSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Reply cannot be empty" }
    ),
});

type Inputs = z.infer<typeof replyEditSchema>;

interface EditReplyFormProps {
  closeModal: () => void;
  replyId: string;
  discussionId: string;
  discussionType: DiscussionType;
  initialText: string;
  isReplyToReply?: boolean;
}

export const EditReplyForm: React.FC<EditReplyFormProps> = ({
  closeModal,
  discussionId,
  discussionType,
  initialText,
  replyId,
  isReplyToReply = false,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(replyEditSchema),
    defaultValues: {
      text: initialText,
    },
  });

  const { mutate: editReply, isLoading } = useEditReply({
    closeModal,
    discussionId,
    discussionType,
    isReplyToReply,
  });

  function handleEditReply(data: Inputs) {
    editReply({
      ...data,
      replyId,
    });
  }

  function onSubmit(data: Inputs) {
    handleEditReply(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="reply-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Type your reply here..."
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
        form="reply-edit-form"
        disabled={isLoading}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Save
        <span className="sr-only">Edit Reply</span>
      </Button>
    </div>
  );
};
