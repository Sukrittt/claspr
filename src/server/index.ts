import { createTRPCRouter } from "@/server/trpc";
import { exampleRouter } from "./routers/example";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
