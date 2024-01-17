import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { classRouter } from "@/server/routers/class";
import { sectionRouter } from "@/server/routers/section";
import { announcementRouter } from "@/server/routers/annoucement";

export const appRouter = createTRPCRouter({
  user: userRouter,
  class: classRouter,
  section: sectionRouter,
  announcement: announcementRouter,
});

export type AppRouter = typeof appRouter;
