import { createTRPCRouter } from "@/server/trpc";

import {
  createAssignment,
  getAssignments,
  getAssignment,
} from "@/server/assignment/routes";

export const assignmentRouter = createTRPCRouter({
  createAssignment,
  getAssignments,
  getAssignment,
});
