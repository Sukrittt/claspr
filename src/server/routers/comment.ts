import { createTRPCRouter } from "@/server/trpc";

import {
  createComment,
  getComments,
  editComment,
  removeComment,
} from "@/server/comment/routes";

export const commentRouter = createTRPCRouter({
  createComment,
  getComments,
  editComment,
  removeComment,
});
