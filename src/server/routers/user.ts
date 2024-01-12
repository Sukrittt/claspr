import { createTRPCRouter } from "@/server/trpc";
import {
  getUserRoleByEmail,
  registerUser,
  updateUserDetails,
} from "@/server/user/routes";

export const userRouter = createTRPCRouter({
  registerUser,
  getUserRoleByEmail,
  updateUserDetails,
});
