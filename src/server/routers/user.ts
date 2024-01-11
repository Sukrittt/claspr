import { createTRPCRouter } from "@/server/trpc";
import { getUserRoleByEmail, registerUser } from "@/server/user/routes";

export const userRouter = createTRPCRouter({
  registerUser,
  getUserRoleByEmail,
});
