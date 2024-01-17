import { createTRPCRouter } from "@/server/trpc";

import { createAnnouncement } from "@/server/announcement/routes";

export const announcementRouter = createTRPCRouter({
  createAnnouncement,
});
