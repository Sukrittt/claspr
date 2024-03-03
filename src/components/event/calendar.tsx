"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfDay,
} from "date-fns";

import { EventContext } from "./event-context";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export const Calendar = () => {
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

  const handleNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  };

  const handlePreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
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
            <div
              className="border hover:bg-neutral-100 transition p-1.5 cursor-pointer rounded-lg"
              onClick={handlePreviousMonth}
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
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="space-y-2 h-full">
          <EventContext calendarDates={calendarDates} />
        </div>
      </div>
    </div>
  );
};