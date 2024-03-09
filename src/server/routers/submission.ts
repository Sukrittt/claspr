import { createTRPCRouter } from "@/server/trpc";
import {
  createSubmission,
  getSubmission,
  unsubmit,
  getAllSubmissions,
  getAssignmentSubmissions,
} from "@/server/submission/routes";

export const submissionRouter = createTRPCRouter({
  createSubmission,
  getSubmission,
  unsubmit,
  getAllSubmissions,
  getAssignmentSubmissions,
});
