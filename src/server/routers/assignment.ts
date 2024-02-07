import { createTRPCRouter } from "@/server/trpc";

import {
  createAssignment,
  getAssignments,
  getAssignment,
  submitReview,
  editAssignmentContent,
  getNotSubmittedStudents,
} from "@/server/assignment/routes";

export const assignmentRouter = createTRPCRouter({
  createAssignment,
  getAssignments,
  getAssignment,
  submitReview,
  editAssignmentContent,
  getNotSubmittedStudents,
});
