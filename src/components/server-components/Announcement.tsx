import { notFound } from "next/navigation";

import { serverClient } from "@/trpc/server-client";

export const Announcement = async ({
  announcementId,
}: {
  announcementId: string;
}) => {
  const announcement = await serverClient.announcement.getAnnouncementById({
    announcementId,
  });

  if (!announcement) notFound();

  return <div>{announcement.title}</div>;
};
