import { trpc } from "@/trpc/client";

export const useGetUpcomingEvents = (classroomId?: string) => {
  return trpc.event.getEvents.useQuery({ classroomId });
};

export const useCreateEvent = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.event.createEvent.useMutation({
    onSuccess: () => {
      closeModal();
      utils.event.getEvents.invalidate();
    },
  });
};
