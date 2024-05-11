import { Suspense } from "react";

import { db } from "@/lib/db";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { Classroom } from "@/components/server-components/Classroom";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

interface ClassPageProps {
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
    title: SITE_TITLE.CLASSROOM(classroom?.title || "Classroom"),
    description: SITE_DESCRIPTION.CLASSROOM(classroom?.title || "Classroom"),
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
