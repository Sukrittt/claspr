import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useCreateConversation = () => {
  const utils = trpc.useUtils();

  return trpc.conversation.createConversation.useMutation({
    onSuccess: () => {
      utils.conversation.getPreviousConversations.invalidate();
    },
  });
};

export const useConversation = (
  classroomId?: string,
  noteId?: string,
  limit?: number
) => {
  return trpc.conversation.getPreviousConversations.useQuery({
    classroomId,
    noteId,
    limit,
  });
};

export const useClearConversation = () => {
  const utils = trpc.useUtils();

  return trpc.conversation.clearConversation.useMutation({
    onMutate: async ({ classroomId }) => {
      await utils.conversation.getPreviousConversations.cancel({ classroomId });

      const prevConversations =
        utils.conversation.getPreviousConversations.getData();

      utils.conversation.getPreviousConversations.setData({ classroomId }, []);

      return { prevConversations };
    },
    onError: (error, { classroomId }, ctx) => {
      utils.conversation.getPreviousConversations.setData(
        { classroomId },
        ctx?.prevConversations
      );

      toast.error(error.message);
    },
    onSettled: (error, _, { classroomId }) => {
      utils.conversation.getPreviousConversations.invalidate({ classroomId });
    },
  });
};

export const useRemoveConversation = ({
  closeModal,
  classroomId,
}: {
  closeModal: () => void;
  classroomId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.conversation.removeConversation.useMutation({
    onMutate: async ({ conversationId }) => {
      closeModal();

      await utils.conversation.getPreviousConversations.cancel({ classroomId });

      const prevConversations =
        utils.conversation.getPreviousConversations.getData();

      utils.conversation.getPreviousConversations.setData(
        { classroomId },
        (prev) =>
          prev?.filter((conversation) => conversation.id !== conversationId)
      );

      return { prevConversations };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.conversation.getPreviousConversations.setData(
        { classroomId },
        ctx?.prevConversations
      );
    },
    onSettled: () => {
      utils.conversation.getPreviousConversations.invalidate({ classroomId });
    },
  });
};

export const useGiveFeedback = ({ classroomId }: { classroomId: string }) => {
  const utils = trpc.useUtils();

  return trpc.conversation.giveFeedback.useMutation({
    onMutate: async ({ conversationId, feedback }) => {
      await utils.conversation.getPreviousConversations.cancel({ classroomId });

      const prevConversations =
        utils.conversation.getPreviousConversations.getData();

      utils.conversation.getPreviousConversations.setData(
        { classroomId },
        (prev) =>
          prev?.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  feedback:
                    conversation.feedback === feedback ? null : feedback,
                }
              : conversation
          )
      );

      return { prevConversations };
    },
    onError: (error, data, ctx) => {
      toast.error(error.message);

      utils.conversation.getPreviousConversations.setData(
        { classroomId },
        ctx?.prevConversations
      );
    },
    onSettled: () => {
      utils.conversation.getPreviousConversations.invalidate({ classroomId });
    },
  });
};
