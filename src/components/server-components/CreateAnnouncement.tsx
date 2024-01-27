import { notFound } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { AnnouncementCard } from "@/components/announcement/announcement-card";

export const CreateAnnouncement = async ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const classroom = await serverClient.class.getClassroom({ classroomId });

  if (!classroom) notFound();

  return <AnnouncementCard classroom={classroom} />;
};
