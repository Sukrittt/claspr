"use client";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { useMounted } from "./use-mounted";
import { useEffect, useState } from "react";

export const useGetUpcomingEvents = (
  classroomId?: string,
  date?: Date,
  clientDate?: Date
) => {
  const mounted = useMounted();
  const [localDate, setLocalDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!mounted) return;

    setLocalDate(new Date());
  }, [mounted]);

  if (!mounted) return;

  const { data, isLoading, refetch } = trpc.event.getEvents.useQuery({
    classroomId,
    date,
    clientDate: localDate,
  });

  return { data, isLoading, refetch };

  // return trpc.event.getEvents.useQuery({
  //   classroomId,
  //   date,
  //   clientDate,
  // });
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

export const useEditEvent = ({ closeModal }: { closeModal?: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.event.editEvent.useMutation({
    onMutate: async ({ eventId, eventDate, title, description }) => {
      closeModal?.();

      await utils.event.getEvents.cancel({
        classroomId: undefined,
      });

      const prevEvents = utils.event.getEvents.getData({
        classroomId: undefined,
      });

      utils.event.getEvents.setData({ classroomId: undefined }, (prev) =>
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
        { classroomId: undefined },
        ctx?.prevEvents
      );
    },
    onSettled: (res) => {
      utils.event.getEvents.invalidate({
        classroomId: undefined,
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
