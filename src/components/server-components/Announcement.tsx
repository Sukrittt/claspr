import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { TeacherView } from "@/components/announcement/page/teacher-view";
import { StudentView } from "@/components/announcement/page/student-view";
import { PartOfClass } from "./PartOfClass";

interface AnnouncementProps {
  announcementId: string;
  classroomId: string;
}

export const Announcement: React.FC<AnnouncementProps> = async ({
  announcementId,
  classroomId,
}) => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  const data = await serverClient.announcement.getAnnouncementById({
    announcementId,
    classroomId,
  });

  const { announcement, isJoinedAsTeacher } = data;

  if (!announcement) notFound();

  const isTeacher =
    isJoinedAsTeacher || announcement.creator.id === session.user.id;

  return (
    <PartOfClass classroomId={classroomId}>
      {isTeacher ? (
        <TeacherView />
      ) : (
        <StudentView announcement={announcement} />
      )}
    </PartOfClass>
  );
};
