import { trpc } from "@/trpc/client";

export const useAddReply = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.discussion.addReply.useMutation({
    onSuccess: () => {
      resetForm();
      utils.discussion.getDiscussionDetails.invalidate();
    },
  });
};
