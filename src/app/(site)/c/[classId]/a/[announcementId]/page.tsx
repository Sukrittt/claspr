import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Announcement } from "@/components/server-components/Announcement";

interface AnnouncementPageProps {
  params: {
    announcementId: string;
    classId: string;
  };
}

export default function page({ params }: AnnouncementPageProps) {
  const { announcementId, classId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Announcement announcementId={announcementId} classroomId={classId} />
    </Suspense>
  );
}
