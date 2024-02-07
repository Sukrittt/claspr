import { toast } from "sonner";

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
