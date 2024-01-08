import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const exampleRouter = createTRPCRouter({
  createContest: publicProcedure.query(async () => {
    return [1, 2, 3];
  }),
});
