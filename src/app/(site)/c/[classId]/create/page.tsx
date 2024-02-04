import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { CreateAssignment } from "@/components/server-components/CreateAssignment";

interface CreateAssignmentPageProps {
  params: {
    classId: string;
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
