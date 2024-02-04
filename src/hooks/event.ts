import { trpc } from "@/trpc/client";

export const useGetUpcomingEvents = (classroomId?: string) => {
  return trpc.event.getEvents.useQuery({ classroomId });
};
