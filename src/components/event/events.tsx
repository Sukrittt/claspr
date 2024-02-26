import { format } from "date-fns";
import { MessageSquareText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { EventSheet } from "./event-sheet";
import { ContainerVariants } from "@/lib/motion";
import { useGetUpcomingEvents } from "@/hooks/event";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryChange } from "@/hooks/use-query-change";

export const Events = ({ date }: { date: Date }) => {
  const params = useSearchParams();
  const { data: events, isLoading } = useGetUpcomingEvents(undefined, date);

  const activeEvent = params.get("active");
  const handleQueryChange = useQueryChange();

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
                <div
                  onClick={() =>
                    handleQueryChange("/calendar", { active: event.id })
                  }
                  className="rounded-xl border py-2 px-4 tracking-tight space-y-2 cursor-pointer hover:bg-neutral-100 transition"
                >
                  <p className="text-sm text-neutral-800">{event.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs">
                      {format(event.eventDate, "MMMM do, h:mm a")}
                    </p>
                    {event.description && (
                      <MessageSquareText className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </EventSheet>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
