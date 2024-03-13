"use client";
import { useAtom } from "jotai";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { ExtendedEvent } from "@/types";
import { EventItem } from "./event-item";
import { EventSheet } from "./event-sheet";
import { ContainerVariants } from "@/lib/motion";
import { useGetUpcomingEvents } from "@/hooks/event";
import { activeDateAtom, overDateAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventSkeleton } from "@/components/skeletons/event-skeleton";

interface EventsProps {
  date: Date;
  sessionId: string;
}

export const Events: React.FC<EventsProps> = ({ date, sessionId }) => {
  const params = useSearchParams();

  const [overDate, setOverDate] = useAtom(overDateAtom);
  const [activeDateObj, setActiveDateObj] = useAtom(activeDateAtom);

  const { data: serverEvents, isLoading } = useGetUpcomingEvents(
    undefined,
    date
  );

  const [events, setEvents] = useState<ExtendedEvent[] | undefined>(
    serverEvents
  );

  useEffect(() => {
    if (serverEvents) {
      setEvents(serverEvents);
    }
  }, [serverEvents]);

  useEffect(() => {
    if (!activeDateObj || !overDate) return;

    const activeDate = activeDateObj.dateColumn;
    const activeEvent = activeDateObj.event;

    const isToBeFiltered = isSameDay(date, activeDate);

    const isToBeAdded = isSameDay(date, overDate);

    if (isToBeFiltered) {
      setEvents((prev) => {
        if (!prev) return;

        return prev.filter((event) => event.id !== activeEvent.id);
      });
    } else if (isToBeAdded) {
      setEvents((prev) => {
        if (!prev) return;

        const updatedEvent = {
          ...activeEvent,
          eventDate: date,
        };

        const updatedEvents = [...prev, updatedEvent];
        updatedEvents.sort(
          (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
        );

        return updatedEvents;
      });

      setActiveDateObj(null);
      setOverDate(null);
    }
  }, [activeDateObj, overDate, date]);

  const activeEvent = params.get("active");

  return (
    <ScrollArea className="h-[60vh] pr-0">
      {isLoading ? (
        <EventSkeleton />
      ) : !events || events.length === 0 ? (
        <></>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4 h-full"
          >
            {events.map((event) => (
              <EventSheet
                key={event.id}
                event={event}
                isActive={event.id === activeEvent}
                sessionId={sessionId}
              >
                <EventItem event={event} sessionId={sessionId} />
              </EventSheet>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
