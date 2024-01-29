import { createTRPCRouter } from "@/server/trpc";

import {
  createEvent,
  getClassEvents,
  getUserEvents,
} from "@/server/event/routes";

export const eventRouter = createTRPCRouter({
  createEvent,
  getClassEvents,
  getUserEvents,
});
