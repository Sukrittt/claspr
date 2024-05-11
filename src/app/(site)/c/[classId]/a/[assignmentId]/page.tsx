import { Suspense } from "react";

import { db } from "@/lib/db";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Assignment } from "@/components/server-components/Assignment";

interface AssignmentPageProps {
  params: {
    assignmentId: string;
    classId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { assignmentId: string };
}) {
  const { assignmentId } = params;

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      title: true,
    },
  });

  return {
    title: SITE_TITLE.ASSIGNMENT(assignment?.title || "Assignment"),
    description: SITE_DESCRIPTION.ASSIGNMENT,
  };
}

export default function page({ params }: AssignmentPageProps) {
  const { assignmentId, classId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Assignment assignmentId={assignmentId} classroomId={classId} />
    </Suspense>
  );
}
