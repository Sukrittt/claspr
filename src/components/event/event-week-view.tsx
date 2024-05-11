import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";

import { currentDateAtom } from "@/atoms";
import { EventContext } from "./event-context";
import { ContainerVariants } from "@/lib/motion";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

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
    return <LoadingScreen fullHeight />;
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
