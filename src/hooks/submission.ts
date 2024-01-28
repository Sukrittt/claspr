import { trpc } from "@/trpc/client";

export const useGetSubmission = (announcementId: string) => {
  return trpc.submission.getSubmission.useQuery({ announcementId });
};

export const useCreateSubmission = () => {
  const utils = trpc.useUtils();

  return trpc.submission.createSubmission.useMutation({
    onSuccess: () => {
      utils.submission.getSubmission.invalidate();
    },
  });
};
