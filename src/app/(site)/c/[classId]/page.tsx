import { Suspense } from "react";

import { Classroom } from "@/components/server-components/Classroom";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
