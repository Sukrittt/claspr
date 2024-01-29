import { createTRPCRouter } from "@/server/trpc";
import {
  createSubmission,
  getSubmission,
  unsubmit,
} from "@/server/submission/routes";

export const submissionRouter = createTRPCRouter({
  createSubmission,
  getSubmission,
  unsubmit,
});
