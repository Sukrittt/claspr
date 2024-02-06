import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { PartOfClass } from "./PartOfClass";
import { serverClient } from "@/trpc/server-client";
import { TeacherView } from "@/components/assignment/page/teacher-view";
import { StudentView } from "@/components/assignment/page/student-view";

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
      {isTeacher ? (
        <TeacherView assignment={assignment} />
      ) : (
        <StudentView assignment={assignment} session={session} />
      )}
    </PartOfClass>
  );
};
