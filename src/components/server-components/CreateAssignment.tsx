import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { AssignmentCard } from "@/components/assignment/assignment-card";

export const CreateAssignment = async ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const session = await getAuthSession();
  const classroom = await serverClient.class.getClassroom({ classroomId });

  if (!session) redirect("/sign-in");

  if (!classroom) notFound();

  const isMember = classroom.students.find(
    (student) => student.userId === session.user.id
  );
  const isTeacher =
    classroom.teacherId === session.user.id || isMember?.isTeacher;

  if (!isTeacher && !isMember) notFound();

  if (!isTeacher) redirect(`/c/${classroomId}`);

  return <AssignmentCard classroom={classroom} />;
};
