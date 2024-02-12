import { toast } from "sonner";
import { DiscussionType } from "@prisma/client";

import { trpc } from "@/trpc/client";

export const useAddReply = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.discussion.addReply.useMutation({
    onSuccess: () => {
      resetForm();
      utils.discussion.getDiscussionDetails.invalidate();
      utils.discussion.getHelpfulUsers.invalidate();
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
      utils.discussion.getHelpfulUsers.invalidate();
    },
  });
};

interface ToggleAnswerSelectionProps {
  discussionId: string;
  discussionType: DiscussionType;
  isReplyToReply?: boolean;
}

export const useToggleAnswerSelection = ({
  discussionId,
  discussionType,
  isReplyToReply,
}: ToggleAnswerSelectionProps) => {
  const utils = trpc.useUtils();

  return trpc.discussion.toggleAnswerSelection.useMutation({
    onMutate: async ({ replyId }) => {
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
                    selected: !reply.selected,
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
                        selected: !reply.selected,
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
