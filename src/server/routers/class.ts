import { createTRPCRouter } from "@/server/trpc";
import {
  createClass,
  getClassesCreated,
  getClassesJoined,
  joinClass,
  removeClass,
  moveClass,
  renameClass,
  setNickName,
  leaveClass,
  updateViewCount,
  getClassroom,
} from "@/server/class/routes";

export const classRouter = createTRPCRouter({
  createClass,
  joinClass,
  getClassesCreated,
  getClassesJoined,
  removeClass,
  moveClass,
  renameClass,
  setNickName,
  leaveClass,
  updateViewCount,
  getClassroom,
});
