import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

interface UseClassProps {
  classroomId: string;
  isTeacher?: boolean;
}

export const useGetPartOfClass = ({
  classroomId,
  isTeacher,
}: UseClassProps) => {
  return trpc.class.getIsPartOfClass.useQuery({ isTeacher, classroomId });
};

export const useClassroomDescription = (classroomId: string) => {
  return trpc.class.getDescription.useQuery({ classroomId });
};

export const useEditClassDescription = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.class.addDescription.useMutation({
    onMutate: async ({ description, classroomId }) => {
      closeModal();

      await utils.class.getDescription.cancel({ classroomId });

      const prevClassroomDesc = utils.class.getDescription.getData();

      utils.class.getDescription.setData({ classroomId }, description);

      return { prevClassroomDesc };
    },
    onError: (error, { classroomId }, ctx) => {
      toast.error(error.message);

      utils.class.getDescription.setData(
        { classroomId },
        ctx?.prevClassroomDesc
      );
    },
    onSettled: (data, _, { classroomId }) => {
      utils.class.getDescription.invalidate({ classroomId });
      router.refresh();
    },
  });
};

export const useUserClassrooms = () => {
  return trpc.class.getAllClassrooms.useQuery();
};

export const usePendingAssignments = (classroomId: string) => {
  return trpc.class.getPendingAssignments.useQuery({ classroomId });
};

export const useEditClassroom = () => {
  const utils = trpc.useUtils();
  const router = useRouter();

  return trpc.class.editClassroomDetails.useMutation({
    onSuccess: (_, { classroomId }) => {
      toast.success("Classroom details updated successfully.");

      router.refresh();
      utils.class.getDescription.invalidate({ classroomId });
    },
  });
};

export const useRemoveClassroom = ({
  mutations,
}: {
  mutations: () => void;
}) => {
  const router = useRouter();

  return trpc.class.removeClass.useMutation({
    onMutate: () => {
      mutations();
    },
    onSuccess: () => {
      toast.success("Classroom deleted successfully.");
      router.push("/dashboard");
    },
  });
};

export const useKickMember = ({ closeModal }: { closeModal: () => void }) => {
  const router = useRouter();

  return trpc.class.leaveClass.useMutation({
    onSuccess: () => {
      toast.success("Student kicked successfully.");

      closeModal();
      router.refresh();
    },
  });
};
