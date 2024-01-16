import { createTRPCRouter } from "@/server/trpc";
import {
  createClass,
  getClassesCreated,
  getClassesJoined,
  joinClass,
  removeClass,
  renameClass,
} from "@/server/class/routes";

export const classRouter = createTRPCRouter({
  createClass,
  joinClass,
  getClassesCreated,
  getClassesJoined,
  removeClass,
  renameClass,
});
