"use client";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

export const useGetUpcomingEvents = (classroomId?: string, date?: Date) => {
  return trpc.event.getEvents.useQuery({
    classroomId,
    date,
  });
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

export const useEditEvent = ({
  closeModal,
  date,
}: {
  closeModal?: () => void;
  date?: Date;
}) => {
  const utils = trpc.useUtils();

  return trpc.event.editEvent.useMutation({
    onMutate: async ({ eventId, eventDate, title, description }) => {
      closeModal?.();

      await utils.event.getEvents.cancel({
        classroomId: undefined,
        date,
      });

      const prevEvents = utils.event.getEvents.getData({
        classroomId: undefined,
        date,
      });

      utils.event.getEvents.setData({ classroomId: undefined, date }, (prev) =>
        prev?.map((event) =>
          event.id === eventId
            ? {
                ...event,
                title: title ?? event.title,
                description: description ?? event.description,
                eventDate: eventDate ?? event.eventDate,
              }
            : event
        )
      );

      return { prevEvents };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.event.getEvents.setData(
        { classroomId: undefined, date },
        ctx?.prevEvents
      );
    },
    onSettled: (res) => {
      utils.event.getEvents.invalidate({
        classroomId: undefined,
        date,
      });
    },
  });
};

export const useRemoveEvent = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.event.removeEvent.useMutation({
    onMutate: async ({ eventId }) => {
      closeModal();

      await utils.event.getEvents.cancel({ classroomId: undefined });

      const prevEvents = utils.event.getEvents.getData({
        classroomId: undefined,
      });

      utils.event.getEvents.setData({ classroomId: undefined }, (prev) =>
        prev?.filter((event) => event.id !== eventId)
      );

      return { prevEvents };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.event.getEvents.setData(
        { classroomId: undefined },
        ctx?.prevEvents
      );
    },
    onSettled: () => {
      utils.event.getEvents.invalidate();
    },
  });
};
