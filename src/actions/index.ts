"use server";
import { serverClient } from "@/trpc/server-client";

export const getUpcomingEvents = async (date: Date) => {
  const events = await serverClient.event.getEvents({
    classroomId: undefined,
    date,
  });

  return events;
};
