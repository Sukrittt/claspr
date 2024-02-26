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
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";

import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Events } from "./events";

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
            <span className="font-semibold tracking-tight cursor-pointer border hover:bg-neutral-100 transition py-1 text-sm px-6 rounded-lg">
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
          <div className="grid grid-cols-7 place-items-center gap-4 h-[95%]">
            {calendarDates.map((date) => (
              <div
                key={date.toISOString()}
                className="flex flex-col gap-y-2 h-full w-full"
              >
                <div
                  className={cn("rounded-xl border p-4 w-full", {
                    "bg-neutral-800": isSameDay(date, new Date()),
                  })}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col gap-y-2 items-center">
                      <span
                        className={cn(
                          "text-sm tracking-tight text-muted-foreground",
                          {
                            "text-neutral-100": isSameDay(date, new Date()),
                          }
                        )}
                      >
                        {format(date, "EEEE")}
                      </span>
                      <span
                        className={cn(
                          "text-2xl font-semibold text-neutral-800",
                          {
                            "text-neutral-100": isSameDay(date, new Date()),
                          }
                        )}
                      >
                        {format(date, "d")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-full rounded-xl border w-full p-2">
                  <Events date={date} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
