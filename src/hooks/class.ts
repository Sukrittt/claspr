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
