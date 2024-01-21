import { Suspense } from "react";

import { Classroom } from "@/components/server-components/Classroom";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

interface ClassPageProps {
  params: {
    classId: string;
  };
}

export default async function page({ params }: ClassPageProps) {
  const { classId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Classroom classroomId={classId} />
    </Suspense>
  );
}
