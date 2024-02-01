import { trpc } from "@/trpc/client";

export const useGetComments = (announcementId: string) => {
  return trpc.announcement.getComments.useQuery({ announcementId });
};

export const useCreateComment = ({ resetForm }: { resetForm: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.announcement.createComment.useMutation({
    onSuccess: (_, { announcementId }) => {
      resetForm();
      utils.announcement.getComments.invalidate({ announcementId });
    },
  });
};
