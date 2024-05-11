import { Suspense } from "react";

import { db } from "@/lib/db";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { CreateAssignment } from "@/components/server-components/CreateAssignment";

interface CreateAssignmentPageProps {
  params: {
    classId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;

  const classroom = await db.classRoom.findUnique({
    where: { id: classId },
    select: {
      title: true,
    },
  });

  return {
    title: SITE_TITLE.CREATE_ASSIGNMENT(
      classroom?.title || "Create Assignment"
    ),
    description: SITE_DESCRIPTION.CREATE_ASSIGNMENT,
  };
}

export default function page({ params }: CreateAssignmentPageProps) {
  const { classId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <CreateAssignment classroomId={classId} />
    </Suspense>
  );
}
