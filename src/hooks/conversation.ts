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

export const useConversation = (classroomId: string) => {
  return trpc.conversation.getPreviousConversations.useQuery({ classroomId });
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

export const useRemoveConversation = () => {
  //perform optimistic update
  return trpc.conversation.removeConversation.useMutation();
};
