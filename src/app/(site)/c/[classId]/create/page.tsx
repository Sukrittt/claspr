import { AnnouncementCard } from "@/components/announcement/announcement-card";

interface CreateAnnouncementPageProps {
  params: {
    classId: string;
  };
}

export default function page({ params }: CreateAnnouncementPageProps) {
  const { classId } = params;

  return <AnnouncementCard classroomId={classId} />;
}
