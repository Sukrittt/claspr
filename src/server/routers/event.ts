import { createTRPCRouter } from "@/server/trpc";

import { createEvent, getEvents } from "@/server/event/routes";

export const eventRouter = createTRPCRouter({
  createEvent,
  getEvents,
});
