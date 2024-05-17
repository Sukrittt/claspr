import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { PartOfClass } from "./PartOfClass";
import { getShortenedText } from "@/lib/utils";
import { serverClient } from "@/trpc/server-client";
import { TeacherView } from "@/components/assignment/page/teacher-view";
import { StudentView } from "@/components/assignment/page/student-view";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";

interface AssignmentProps {
  assignmentId: string;
  classroomId: string;
}

export const Assignment: React.FC<AssignmentProps> = async ({
  assignmentId,
  classroomId,
}) => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  const data = await serverClient.assignment.getAssignment({
    assignmentId,
    classroomId,
  });

  const { assignment, isJoinedAsTeacher } = data;

  if (!assignment) notFound();

  const isTeacher =
    isJoinedAsTeacher || assignment.creator.id === session.user.id;

  return (
    <PartOfClass classroomId={classroomId}>
      <BreadcrumbProvider
        breadcrumbs={[
          {
            label: getShortenedText(assignment.classRoom.title, 25),
            href: `/c/${classroomId}`,
          },
          {
            label: getShortenedText(assignment.title, 25),
            href: `/c/${classroomId}/a/${assignmentId}`,
          },
        ]}
      >
        {isTeacher ? (
          <TeacherView assignment={assignment} session={session} />
        ) : (
          <StudentView assignment={assignment} session={session} />
        )}
      </BreadcrumbProvider>
    </PartOfClass>
  );
};
