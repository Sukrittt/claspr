import { createTRPCRouter } from "@/server/trpc";
import {
  createSubmission,
  getUploadedMedia,
  createMedia,
  getSubmission,
} from "@/server/submission/routes";

export const submissionRouter = createTRPCRouter({
  createSubmission,
  getUploadedMedia,
  createMedia,
  getSubmission,
});
