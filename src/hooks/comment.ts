import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useGetComments = (assignmentId: string) => {
  return trpc.comment.getComments.useQuery({ assignmentId });
};

export const useCreateComment = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.comment.createComment.useMutation({
    onSuccess: (_, { assignmentId }) => {
      resetForm();
      utils.comment.getComments.invalidate({ assignmentId });
    },
  });
};

export const useEditComment = ({
  closeModal,
  assignmentId,
}: {
  closeModal: () => void;
  assignmentId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.comment.editComment.useMutation({
    onMutate: async ({ commentId, message }) => {
      closeModal();
      await utils.comment.getComments.cancel({ assignmentId });

      const prevComments = utils.comment.getComments.getData();

      utils.comment.getComments.setData({ assignmentId }, (prev) =>
        prev?.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                message,
                isEdited: true,
              }
            : comment
        )
      );

      return { prevComments };
    },
    onError: (err, data, ctx) => {
      toast.error(err.message);

      utils.comment.getComments.setData({ assignmentId }, ctx?.prevComments);
    },
    onSettled: () => {
      utils.comment.getComments.invalidate({ assignmentId });
    },
  });
};

export const useRemoveComment = ({
  closeModal,
  assignmentId,
}: {
  closeModal: () => void;
  assignmentId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.comment.removeComment.useMutation({
    onMutate: async ({ commentId }) => {
      closeModal();
      await utils.comment.getComments.cancel({ assignmentId });

      const prevComments = utils.comment.getComments.getData();

      utils.comment.getComments.setData({ assignmentId }, (prev) =>
        prev?.filter((comment) => comment.id !== commentId)
      );

      return { prevComments };
    },
    onError: (err, data, ctx) => {
      toast.error(err.message);

      utils.comment.getComments.setData({ assignmentId }, ctx?.prevComments);
    },
    onSettled: () => {
      utils.comment.getComments.invalidate({ assignmentId });
    },
  });
};
