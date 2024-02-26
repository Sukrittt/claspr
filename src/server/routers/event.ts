import { createTRPCRouter } from "@/server/trpc";

import {
  createEvent,
  getEvents,
  editEvent,
  removeEvent,
} from "@/server/event/routes";

export const eventRouter = createTRPCRouter({
  createEvent,
  getEvents,
  editEvent,
  removeEvent,
});
