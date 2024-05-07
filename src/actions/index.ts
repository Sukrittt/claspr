"use server";

import { serverClient } from "@/trpc/server-client";

export const getUpcomingEvents = async (date: Date) => {
  const serverDate = new Date(date);

  console.log("CLIENT DATE", format("MMMM do, h:mm a", date));
  console.log("SERVER DATE", format("MMMM do, h:mm a", serverDate));

  const events = await serverClient.event.getEvents({
    classroomId: undefined,
    date: serverDate,
  });

  return events;
};
