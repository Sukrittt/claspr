import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { mediaRouter } from "@/server/routers/media";
import { eventRouter } from "@/server/routers/event";
import { classRouter } from "@/server/routers/class";
import { sectionRouter } from "@/server/routers/section";
import { submissionRouter } from "@/server/routers/submission";
import { announcementRouter } from "@/server/routers/annoucement";
import { conversationRouter } from "@/server/routers/conversation";
import { commentRouter } from "@/server/routers/comment";

export const appRouter = createTRPCRouter({
  user: userRouter,
  class: classRouter,
  section: sectionRouter,
  announcement: announcementRouter,
  conversation: conversationRouter,
  submission: submissionRouter,
  media: mediaRouter,
  event: eventRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
