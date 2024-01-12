import { createTRPCRouter } from "@/server/trpc";
import { createClass } from "@/server/class/routes";

export const classRouter = createTRPCRouter({
  createClass,
});
