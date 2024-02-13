import { createTRPCRouter } from "@/server/trpc";
import {
  getUserRoleByEmail,
  registerUser,
  onBoardUser,
  getFolders,
} from "@/server/user/routes";

export const userRouter = createTRPCRouter({
  registerUser,
  getUserRoleByEmail,
  onBoardUser,
  getFolders,
});
