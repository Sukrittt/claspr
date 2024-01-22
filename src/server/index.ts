import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { classRouter } from "@/server/routers/class";
import { sectionRouter } from "@/server/routers/section";
import { announcementRouter } from "@/server/routers/annoucement";
import { conversationRouter } from "@/server/routers/conversation";

export const appRouter = createTRPCRouter({
  user: userRouter,
  class: classRouter,
  section: sectionRouter,
  announcement: announcementRouter,
  conversation: conversationRouter,
});

export type AppRouter = typeof appRouter;
