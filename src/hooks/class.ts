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
