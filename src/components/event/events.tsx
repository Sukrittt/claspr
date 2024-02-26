import { AnimatePresence, motion } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { useGetUpcomingEvents } from "@/hooks/event";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Events = ({ date }: { date: Date }) => {
  const { data: events, isLoading } = useGetUpcomingEvents(undefined, date);

  return (
    <ScrollArea className="h-[60vh]">
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
              <div key={event.id}>
                <p>{event.title}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
