import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { EventItem } from "./event-item";
import { EventSheet } from "./event-sheet";
import { ContainerVariants } from "@/lib/motion";
import { useGetUpcomingEvents } from "@/hooks/event";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Events = ({ date }: { date: Date }) => {
  const params = useSearchParams();
  const { data: events, isLoading } = useGetUpcomingEvents(undefined, date);

  const activeEvent = params.get("active");

  return (
    <ScrollArea className="h-[60vh] pr-0">
      {isLoading ? (
        <p>Loading...</p>
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
              >
                <EventItem event={event} />
              </EventSheet>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
