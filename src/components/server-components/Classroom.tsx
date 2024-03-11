import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { PartOfClass } from "./PartOfClass";
import { serverClient } from "@/trpc/server-client";
import { ClassroomLayout } from "@/components/classroom/classroom-layout";

export const Classroom = async ({ classroomId }: { classroomId: string }) => {
  const session = await getAuthSession();
  const classroom = await serverClient.class.getClassroom({ classroomId });

  if (!session) redirect("/sign-in");

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: { role: true },
  });

  if (!user || !user.role) redirect("/sign-in");

  if (!classroom) notFound();

  return (
    <PartOfClass classroomId={classroomId}>
      <ClassroomLayout
        classroom={classroom}
        session={session}
        userRole={user.role}
      />
    </PartOfClass>
  );
};
