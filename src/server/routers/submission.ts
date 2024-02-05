import { createTRPCRouter } from "@/server/trpc";
import {
  createSubmission,
  getSubmission,
  unsubmit,
  getAssignmentSubmissions,
} from "@/server/submission/routes";

export const submissionRouter = createTRPCRouter({
  createSubmission,
  getSubmission,
  unsubmit,
  getAssignmentSubmissions,
});
