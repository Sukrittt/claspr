import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { mediaRouter } from "@/server/routers/media";
import { eventRouter } from "@/server/routers/event";
import { classRouter } from "@/server/routers/class";
import { folderRouter } from "@/server/routers/folder";
import { sectionRouter } from "@/server/routers/section";
import { commentRouter } from "@/server/routers/comment";
import { discussionRouter } from "@/server/routers/discussion";
import { submissionRouter } from "@/server/routers/submission";
import { assignmentRouter } from "@/server/routers/assignment";
import { conversationRouter } from "@/server/routers/conversation";

export const appRouter = createTRPCRouter({
  user: userRouter,
  class: classRouter,
  section: sectionRouter,
  assignment: assignmentRouter,
  conversation: conversationRouter,
  submission: submissionRouter,
  media: mediaRouter,
  event: eventRouter,
  comment: commentRouter,
  discussion: discussionRouter,
  folder: folderRouter,
});

export type AppRouter = typeof appRouter;
