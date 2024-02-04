import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Assignment } from "@/components/server-components/Assignment";

interface AssignmentPageProps {
  params: {
    assignmentId: string;
    classId: string;
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
