import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";

import { currentDateAtom } from "@/atoms";
import { EventContext } from "./event-context";
import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EventMonthView = ({ sessionId }: { sessionId: string }) => {
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [currentDate] = useAtom(currentDateAtom);

  const updateCalendarDates = (newDate: Date) => {
    const firstDayOfMonth = startOfMonth(newDate);
    const lastDayOfMonth = endOfMonth(newDate);

    const datesOfMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

    setCalendarDates(datesOfMonth);
  };

  useEffect(() => {
    updateCalendarDates(currentDate);
  }, [currentDate]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ScrollArea className="h-[75vh]">
          <EventContext
            calendarDates={calendarDates}
            sessionId={sessionId}
            mode="month"
          />
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};
