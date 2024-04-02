import { z } from "zod";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { SubmissionStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ExtendedAssignment } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubmitReview } from "@/hooks/assignment";

const commentCreationSchema = z.object({
  message: z.string().max(80).optional(),
});

type Inputs = z.infer<typeof commentCreationSchema>;

interface TeacherReviewInputProps {
  assignment: ExtendedAssignment;
  selectedReview: SubmissionStatus;
  submissionId: string;
  closeModal: () => void;
}

export const TeacherReviewInput: React.FC<TeacherReviewInputProps> = ({
  assignment,
  selectedReview,
  closeModal,
  submissionId,
}) => {
  const getEmptyReviewComment = useCallback(() => {
    if (selectedReview === "APPROVED")
      return "Your work has been approved. Great job!";

    return "You work has been marked as pending.";
  }, [selectedReview]);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(commentCreationSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleCleanups = () => {
    form.reset();
    closeModal();
  };

  const { mutate: submitReview, isLoading } = useSubmitReview({
    handleCleanups,
  });

  function handleCreateComment(data: Inputs) {
    if (
      selectedReview === "CHANGES_REQUESTED" &&
      form.getValues("message")?.length === 0
    ) {
      form.setError("message", {
        message: "Message is required when changes required.",
      });
      return;
    }

    const reviewComment = getEmptyReviewComment();

    submitReview({
      message: data.message || reviewComment,
      assignmentId: assignment.id,
      submissionId,
      submissionStatus: selectedReview,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateComment(data);
  }

  const disabled =
    isLoading ||
    (selectedReview === "CHANGES_REQUESTED" &&
      form.getValues("message")?.length === 0);

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
                  <Input
                    type="text"
                    className="h-7 text-xs focus-visible:ring-0 w-full pr-7"
                    disabled={isLoading}
                    autoComplete="off"
                    placeholder="Leave a comment..."
                    {...field}
                  />

                  <Button
                    className="h-7"
                    form="comment-creation-form"
                    disabled={disabled}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-20 text-muted-foreground animate-spin" />
                    ) : (
                      "Submit review"
                    )}
                  </Button>
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
