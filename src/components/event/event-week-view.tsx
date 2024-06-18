import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";

import { currentDateAtom } from "@/atoms";
import { EventContext } from "./event-context";
import { ContainerVariants } from "@/lib/motion";

export const EventWeekView = ({ sessionId }: { sessionId: string }) => {
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [currentDate] = useAtom(currentDateAtom);

  const updateCalendarDates = (newDate: Date) => {
    const firstDayOfWeek = startOfWeek(newDate);
    const lastDayOfWeek = endOfWeek(newDate);

    const datesOfWeek = eachDayOfInterval({
      start: firstDayOfWeek,
      end: lastDayOfWeek,
    });

    setCalendarDates(datesOfWeek);
  };

  useEffect(() => {
    updateCalendarDates(currentDate);
  }, [currentDate]);

  if (calendarDates.length === 0) {
    return (
      <div className="flex h-[65vh] items-center justify-center text-sm text-gray-700 dark:text-gray-300">
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        Getting things ready...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        <EventContext
          calendarDates={calendarDates}
          sessionId={sessionId}
          mode="week"
        />
      </motion.div>
    </AnimatePresence>
  );
};
