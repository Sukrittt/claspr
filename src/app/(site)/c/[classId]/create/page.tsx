import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { CreateAnnouncement } from "@/components/server-components/CreateAnnouncement";

interface CreateAnnouncementPageProps {
  params: {
    classId: string;
  };
}

export default function page({ params }: CreateAnnouncementPageProps) {
  const { classId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <CreateAnnouncement classroomId={classId} />
    </Suspense>
  );
}
