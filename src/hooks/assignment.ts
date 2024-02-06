import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

export const useCreateAssignment = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.assignment.createAssignment.useMutation({
    onSuccess: (_, { classRoomId }) => {
      toast.success("Assignment Posted");
      router.push(`/c/${classRoomId}`);

      utils.assignment.getAssignments.invalidate({
        classroomId: classRoomId,
      });
    },
  });
};

export const useGetAssignments = (classroomId: string) => {
  return trpc.assignment.getAssignments.useQuery({ classroomId });
};

export const useSubmitReview = ({
  handleCleanups,
}: {
  handleCleanups: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.assignment.submitReview.useMutation({
    onSuccess: () => {
      handleCleanups();
      utils.submission.getAssignmentSubmissions.invalidate();
      toast.success("Your review was submitted");
    },
  });
};

export const useNotSubmittedStudents = (assignmentId: string) => {
  return trpc.assignment.getNotSubmittedStudents.useQuery({ assignmentId });
};
