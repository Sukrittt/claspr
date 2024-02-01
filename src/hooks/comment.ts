import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useGetComments = (announcementId: string) => {
  return trpc.comment.getComments.useQuery({ announcementId });
};

export const useCreateComment = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.comment.createComment.useMutation({
    onSuccess: (_, { announcementId }) => {
      resetForm();
      utils.comment.getComments.invalidate({ announcementId });
    },
  });
};

export const useEditComment = ({
  closeModal,
  announcementId,
}: {
  closeModal: () => void;
  announcementId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.comment.editComment.useMutation({
    onMutate: async ({ commentId, message }) => {
      closeModal();
      await utils.comment.getComments.cancel({ announcementId });

      const prevComments = utils.comment.getComments.getData();

      utils.comment.getComments.setData({ announcementId }, (prev) =>
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

      utils.comment.getComments.setData({ announcementId }, ctx?.prevComments);
    },
    onSettled: () => {
      utils.comment.getComments.invalidate({ announcementId });
    },
  });
};

export const useRemoveComment = ({
  closeModal,
  announcementId,
}: {
  closeModal: () => void;
  announcementId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.comment.removeComment.useMutation({
    onMutate: async ({ commentId }) => {
      closeModal();
      await utils.comment.getComments.cancel({ announcementId });

      const prevComments = utils.comment.getComments.getData();

      utils.comment.getComments.setData({ announcementId }, (prev) =>
        prev?.filter((comment) => comment.id !== commentId)
      );

      return { prevComments };
    },
    onError: (err, data, ctx) => {
      toast.error(err.message);

      utils.comment.getComments.setData({ announcementId }, ctx?.prevComments);
    },
    onSettled: () => {
      utils.comment.getComments.invalidate({ announcementId });
    },
  });
};
