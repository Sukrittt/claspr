"use server";
import { add } from "date-fns";

import { serverClient } from "@/trpc/server-client";

export const getUpcomingEvents = async (date: Date) => {
  //   const updatedDate = add(date, {
  //     hours: 5,
  //     minutes: 30,
  //   });

  const events = await serverClient.event.getEvents({
    classroomId: undefined,
    date,
  });

  return events;
};
