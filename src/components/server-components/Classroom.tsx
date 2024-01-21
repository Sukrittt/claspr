import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { serverClient } from "@/trpc/server-client";
import { ClassroomLayout } from "@/components/classroom/classroom-layout";

export const Classroom = async ({ classroomId }: { classroomId: string }) => {
  const session = await getAuthSession();
  const classroom = await serverClient.class.getClassroom({ classroomId });

  if (!session) redirect("/sign-in");

  if (!classroom) notFound();

  return <ClassroomLayout classroom={classroom} session={session} />;
};
