"use server";
import { format } from "date-fns";

import { serverClient } from "@/trpc/server-client";

export const getUpcomingEvents = async (date: Date) => {
  const serverDate = new Date(date);

  console.log("CURRENT DATE", format(new Date(), "MMMM do, h:mm a"));
  console.log("CLIENT DATE", format(date, "MMMM do, h:mm a"));
  console.log("SERVER DATE", format(serverDate, "MMMM do, h:mm a"));

  const events = await serverClient.event.getEvents({
    classroomId: undefined,
    date: serverDate,
  });

  return events;
};
