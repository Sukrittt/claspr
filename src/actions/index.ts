"use server";
import { add } from "date-fns";

import { serverClient } from "@/trpc/server-client";

export const getUpcomingEvents = async (date: Date) => {
  const updatedDate = add(date, {
    days: 1,
  });

  const events = await serverClient.event.getEvents({
    classroomId: undefined,
    date: updatedDate,
  });

  return events;
};
