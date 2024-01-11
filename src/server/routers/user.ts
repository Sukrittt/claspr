import { createTRPCRouter } from "@/server/trpc";
import { registerUser } from "@/server/user/routes";

export const userRouter = createTRPCRouter({
  registerUser,
});
