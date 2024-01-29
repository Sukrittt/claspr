import { createTRPCRouter } from "@/server/trpc";

import {
  createMedia,
  editLink,
  getUploadedMedia,
  removeMedia,
} from "@/server/media/routes";

export const mediaRouter = createTRPCRouter({
  createMedia,
  editLink,
  getUploadedMedia,
  removeMedia,
});
