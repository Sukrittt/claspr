import { DiscussionType } from "@prisma/client";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export const useAddReply = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.discussion.addReply.useMutation({
    onSuccess: () => {
      resetForm();
      utils.discussion.getDiscussionDetails.invalidate();
    },
  });
};

interface EditReplyProps {
  discussionId: string;
  discussionType: DiscussionType;
  closeModal: () => void;
  isReplyToReply?: boolean;
}

export const useEditReply = ({
  closeModal,
  discussionId,
  discussionType,
  isReplyToReply = false,
}: EditReplyProps) => {
  const utils = trpc.useUtils();

  return trpc.discussion.editReply.useMutation({
    onMutate: async ({ replyId, text }) => {
      closeModal();

      await utils.discussion.getDiscussionDetails.cancel({
        discussionId,
        discussionType,
      });

      const prevDetailedDiscussion =
        utils.discussion.getDiscussionDetails.getData();

      if (!isReplyToReply) {
        utils.discussion.getDiscussionDetails.setData(
          { discussionId, discussionType },
          // @ts-ignore
          (prev) => {
            return {
              ...prev,
              replies: prev?.replies.map((reply) => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    text,
                    isEdited: true,
                  };
                }
                return reply;
              }),
            };
          }
        );
      } else {
        utils.discussion.getDiscussionDetails.setData(
          { discussionId, discussionType },
          // @ts-ignore
          (prev) => {
            return {
              ...prev,
              replies: prev?.replies.map((reply) => {
                return {
                  ...reply,
                  replies: reply.replies.map((reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        text,
                        isEdited: true,
                      };
                    }
                    return reply;
                  }),
                };
              }),
            };
          }
        );
      }

      return { prevDetailedDiscussion };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.discussion.getDiscussionDetails.setData(
        { discussionId, discussionType },
        ctx?.prevDetailedDiscussion
      );
    },
    onSettled: () => {
      utils.discussion.getDiscussionDetails.invalidate({
        discussionId,
        discussionType,
      });
    },
  });
};

export const useRemoveReply = ({
  closeModal,
  discussionId,
  discussionType,
  isReplyToReply = false,
}: EditReplyProps) => {
  const utils = trpc.useUtils();

  return trpc.discussion.removeReply.useMutation({
    onMutate: async ({ replyId }) => {
      closeModal();

      await utils.discussion.getDiscussionDetails.cancel({
        discussionId,
        discussionType,
      });

      const prevDetailedDiscussion =
        utils.discussion.getDiscussionDetails.getData();

      if (!isReplyToReply) {
        utils.discussion.getDiscussionDetails.setData(
          { discussionId, discussionType },
          // @ts-ignore
          (prev) => {
            return {
              ...prev,
              replies: prev?.replies.filter((reply) => reply.id !== replyId),
            };
          }
        );
      } else {
        utils.discussion.getDiscussionDetails.setData(
          { discussionId, discussionType },
          // @ts-ignore
          (prev) => {
            return {
              ...prev,
              replies: prev?.replies.map((reply) => {
                return {
                  ...reply,
                  replies: reply.replies.filter(
                    (reply) => reply.id !== replyId
                  ),
                };
              }),
            };
          }
        );
      }

      return { prevDetailedDiscussion };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.discussion.getDiscussionDetails.setData(
        { discussionId, discussionType },
        ctx?.prevDetailedDiscussion
      );
    },
    onSettled: () => {
      utils.discussion.getDiscussionDetails.invalidate({
        discussionId,
        discussionType,
      });
    },
  });
};
