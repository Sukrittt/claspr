import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

export const useCreateAnnouncement = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.announcement.createAnnouncement.useMutation({
    onSuccess: (_, { classRoomId }) => {
      toast.success("Announcement Posted");
      router.push(`/c/${classRoomId}`);

      utils.announcement.getAnnouncements.invalidate({
        classroomId: classRoomId,
      });
    },
  });
};

export const useGetAnnouncements = (classroomId: string) => {
  return trpc.announcement.getAnnouncements.useQuery({ classroomId });
};
