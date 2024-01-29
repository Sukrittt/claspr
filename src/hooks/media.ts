import { trpc } from "@/trpc/client";

export const useGetMedia = (announcementId: string) => {
  return trpc.media.getUploadedMedia.useQuery({ announcementId });
};

export const useCreateMedia = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.media.createMedia.useMutation({
    onSuccess: () => {
      closeModal();
      utils.media.getUploadedMedia.invalidate();
    },
  });
};
