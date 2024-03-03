"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfDay,
  addWeeks,
  subWeeks,
} from "date-fns";

import { EventContext } from "./event-context";
import { CreateEventDialog } from "./dialog/create-event-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export const Calendar = ({ sessionId }: { sessionId: string }) => {
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const datesOfMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
    setCalendarDates(datesOfMonth);
  }, []);

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

  const handleToday = () => {
    const today = startOfDay(new Date());
    setCurrentDate(today);
  };

  const handleNextWeek = () => {
    const nextMonthDate = startOfWeek(addWeeks(currentDate, 1));

    setCurrentDate(nextMonthDate);
  };

  const handlePreviousWeek = () => {
    const previousMonthDate = startOfWeek(subWeeks(currentDate, 1));
    setCurrentDate(previousMonthDate);
  };

  if (calendarDates.length === 0) {
    return <LoadingScreen fullHeight />;
  }

  return (
    <div className="h-[90vh]">
      <div className="space-y-12 py-8 px-10 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl tracking-tight">
            {currentMonth}, {currentYear}
          </h3>
          <div className="flex items-center gap-x-2 text-neutral-700">
            <CreateEventDialog>
              <div className="border hover:bg-neutral-100 transition p-1.5 cursor-pointer rounded-lg">
                <CustomTooltip text="Create Event">
                  <Plus className="h-3.5 w-3.5" />
                </CustomTooltip>
              </div>
            </CreateEventDialog>
            <div
              className="border hover:bg-neutral-100 transition p-1.5 cursor-pointer rounded-lg"
              onClick={handlePreviousWeek}
            >
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span
              onClick={handleToday}
              className="font-semibold tracking-tight cursor-pointer border hover:bg-neutral-100 transition py-1 text-sm px-6 rounded-lg"
            >
              Today
            </span>
            <div
              className="border hover:bg-neutral-100 transition p-1.5 cursor-pointer rounded-lg"
              onClick={handleNextWeek}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="space-y-2 h-full">
          <EventContext calendarDates={calendarDates} sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
};
