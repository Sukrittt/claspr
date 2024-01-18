"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

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

  const handleNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  };

  const handlePreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    setCurrentDate(previousMonthDate);
  };

  const firstDayOfMonth = startOfMonth(currentDate);
  const dayOfWeekOfFirstDay = getDay(firstDayOfMonth);

  if (calendarDates.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6 py-8 px-10">
      <div className="flex items-center justify-around">
        <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl text-center">
          <span className="font-bold">{currentMonth}</span> {currentYear}
        </h1>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-7 place-items-center gap-4 text-sm font-semibold text-muted-foreground">
          <p>Sun</p>
          <p>Mon</p>
          <p>Tue</p>
          <p>Wed</p>
          <p>Thu</p>
          <p>Fri</p>
          <p>Sat</p>
        </div>
        <ScrollArea className="h-[550px] pb-12">
          <div className="grid grid-cols-7 place-items-center gap-4">
            {Array.from({ length: dayOfWeekOfFirstDay }, (_, index) => (
              <div key={`empty-${index}`} className="h-28 w-28" />
            ))}
            {calendarDates.map((date) => (
              <div
                key={date.toISOString()}
                className="rounded-md border border-neutral-300 h-28 w-28 p-2"
              >
                <div
                  className={cn("w-fit text-xs p-2 rounded-full", {
                    "text-muted-foreground": isBefore(date, new Date()),
                    "text-blue-600 border border-sky-500": isSameDay(
                      date,
                      new Date()
                    ),
                  })}
                >
                  {format(date, "d")}
                </div>
                {/* Render events for this date */}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
