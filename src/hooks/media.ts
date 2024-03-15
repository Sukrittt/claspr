import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useGetMedia = (assignmentId: string) => {
  return trpc.media.getUploadedMedia.useQuery({ assignmentId });
};

export const useCreateMedia = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.media.createMedia.useMutation({
    onSuccess: () => {
      closeModal();
      toast.success("Your work has been uploaded");
      utils.media.getUploadedMedia.invalidate();
    },
  });
};

export const useEditLink = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.media.editLink.useMutation({
    onMutate: async (data) => {
      const { assignmentId, mediaId, url, label } = data;

      closeModal();

      await utils.media.getUploadedMedia.cancel({ assignmentId });

      const prevMedia = utils.media.getUploadedMedia.getData();

      utils.media.getUploadedMedia.setData({ assignmentId }, (prev) =>
        prev?.map((media) =>
          media.id !== mediaId ? media : { ...media, url, label: label ?? null }
        )
      );

      return { prevMedia };
    },
    onError: (error, { assignmentId }, ctx) => {
      utils.media.getUploadedMedia.setData({ assignmentId }, ctx?.prevMedia);

      toast.error(error.message);
    },
    onSettled: (_, err, { assignmentId }) => {
      utils.media.getUploadedMedia.invalidate({ assignmentId });
    },
  });
};

export const useRemoveMedia = () => {
  const utils = trpc.useUtils();

  return trpc.media.removeMedia.useMutation({
    onMutate: async (data) => {
      const { assignmentId, mediaId } = data;

      await utils.media.getUploadedMedia.cancel({ assignmentId });

      const prevMedia = utils.media.getUploadedMedia.getData();

      utils.media.getUploadedMedia.setData({ assignmentId }, (prev) =>
        prev?.filter((media) => media.id !== mediaId)
      );

      return { prevMedia };
    },
    onError: (error, { assignmentId }, ctx) => {
      utils.media.getUploadedMedia.setData({ assignmentId }, ctx?.prevMedia);

      toast.error(error.message);
    },
    onSettled: (_, err, { assignmentId }) => {
      utils.media.getUploadedMedia.invalidate({ assignmentId });
    },
  });
};
