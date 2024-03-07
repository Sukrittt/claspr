import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { FilterType } from "@/types";

export const useGetSubmission = (assignmentId: string) => {
  return trpc.submission.getSubmission.useQuery({ assignmentId });
};

export const useCreateSubmission = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.submission.createSubmission.useMutation({
    onSuccess: () => {
      closeModal();
      utils.submission.getSubmission.invalidate();
    },
  });
};

export const useAssignmentSubmissions = (
  assignmentId: string,
  status: FilterType
) => {
  return trpc.submission.getAssignmentSubmissions.useQuery({
    assignmentId,
    status,
  });
};

export const useUnsubmitSubmission = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.submission.unsubmit.useMutation({
    onSuccess: () => {
      closeModal();

      utils.submission.getSubmission.invalidate();
      toast.success("Your work has been unsubmitted.");
    },
  });
};
