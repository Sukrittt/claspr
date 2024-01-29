import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useGetMedia = (announcementId: string) => {
  return trpc.media.getUploadedMedia.useQuery({ announcementId });
};

export const useCreateMedia = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.media.createMedia.useMutation({
    onMutate: () => {
      toast.loading("Just a moment...");
    },
    onSuccess: () => {
      closeModal();
      toast.success("Media successfully uploaded!");
      utils.media.getUploadedMedia.invalidate();
    },
  });
};

export const useEditLink = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.media.editLink.useMutation({
    onMutate: async (data) => {
      const { announcementId, mediaId, url, label } = data;

      closeModal();

      await utils.media.getUploadedMedia.cancel({ announcementId });

      const prevMedia = utils.media.getUploadedMedia.getData();

      utils.media.getUploadedMedia.setData({ announcementId }, (prev) =>
        prev?.map((media) =>
          media.id !== mediaId ? media : { ...media, url, label: label ?? null }
        )
      );

      return { prevMedia };
    },
    onError: (error, { announcementId }, ctx) => {
      utils.media.getUploadedMedia.setData({ announcementId }, ctx?.prevMedia);

      toast.error(error.message);
    },
    onSettled: (_, err, { announcementId }) => {
      utils.media.getUploadedMedia.invalidate({ announcementId });
    },
  });
};

export const useRemoveMedia = () => {
  const utils = trpc.useUtils();

  return trpc.media.removeMedia.useMutation({
    onMutate: async (data) => {
      const { announcementId, mediaId } = data;

      await utils.media.getUploadedMedia.cancel({ announcementId });

      const prevMedia = utils.media.getUploadedMedia.getData();

      utils.media.getUploadedMedia.setData({ announcementId }, (prev) =>
        prev?.filter((media) => media.id !== mediaId)
      );

      return { prevMedia };
    },
    onError: (error, { announcementId }, ctx) => {
      utils.media.getUploadedMedia.setData({ announcementId }, ctx?.prevMedia);

      toast.error(error.message);
    },
    onSettled: (_, err, { announcementId }) => {
      utils.media.getUploadedMedia.invalidate({ announcementId });
    },
  });
};
