import { trpc } from "@/trpc/client";

export const useGetMedia = (announcementId: string) => {
  return trpc.submission.getUploadedMedia.useQuery({ announcementId });
};

export const useCreateMedia = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.submission.createMedia.useMutation({
    onSuccess: () => {
      closeModal();
      utils.submission.getUploadedMedia.invalidate();
    },
  });
};
