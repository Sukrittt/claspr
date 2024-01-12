import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { classRouter } from "@/server/routers/class";

export const appRouter = createTRPCRouter({
  user: userRouter,
  class: classRouter,
});

export type AppRouter = typeof appRouter;
