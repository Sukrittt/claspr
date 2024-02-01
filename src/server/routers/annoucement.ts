import { createTRPCRouter } from "@/server/trpc";

import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  getComments,
  createComment,
} from "@/server/announcement/routes";

export const announcementRouter = createTRPCRouter({
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  getComments,
  createComment,
});
