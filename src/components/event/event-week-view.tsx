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
      <div className="h-[65vh] flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
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
