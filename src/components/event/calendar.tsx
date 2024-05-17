"use client";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  addMonths,
  addWeeks,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

import { EventWeekView } from "./event-week-view";
import { EventMonthView } from "./event-month-view";
import { calendarModeAtom, currentDateAtom } from "@/atoms";
import { SwitchCalendarMode } from "./switch-calendar-mode";
import { CreateEventDialog } from "./dialog/create-event-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const Calendar = ({ sessionId }: { sessionId: string }) => {
  const [calendarMode] = useAtom(calendarModeAtom);
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const handleToday = () => {
    const today = startOfDay(new Date());
    setCurrentDate(today);
  };

  const handleNext = () => {
    let nextDate: Date;

    if (calendarMode === "month") {
      nextDate = startOfMonth(addMonths(currentDate, 1));
    } else {
      nextDate = startOfWeek(addWeeks(currentDate, 1));
    }

    setCurrentDate(nextDate);
  };

  const handlePrevious = () => {
    let previousDate: Date;

    if (calendarMode === "month") {
      previousDate = startOfMonth(subMonths(currentDate, 1));
    } else {
      previousDate = startOfWeek(subWeeks(currentDate, 1));
    }

    setCurrentDate(previousDate);
  };

  return (
    <div className="h-[94vh] w-screen">
      <div className="flex flex-col gap-y-12 py-8 px-10 h-full">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col sm:flex-row gap-y-8 sm:gap-y-0 sm:items-center sm:justify-between">
            <h3 className="text-3xl text-center sm:text-left tracking-tight">
              {currentMonth}, {currentYear}
            </h3>
            <div className="flex items-center gap-x-2 text-neutral-700 dark:text-foreground">
              <SwitchCalendarMode />
              <CreateEventDialog>
                <div className="border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition p-1.5 cursor-pointer rounded-lg">
                  <CustomTooltip text="Create Event">
                    <Plus className="h-3.5 w-3.5" />
                  </CustomTooltip>
                </div>
              </CreateEventDialog>
              <div
                className="hidden sm:block border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition p-1.5 cursor-pointer rounded-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span
                onClick={handleToday}
                className="hidden sm:block font-semibold tracking-tight cursor-pointer border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition py-1 text-sm px-6 rounded-lg flex-1 text-center"
              >
                Today
              </span>
              <div
                className="hidden sm:block border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition p-1.5 cursor-pointer rounded-lg"
                onClick={handleNext}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="sm:hidden flex items-center gap-x-2 text-neutral-700 dark:text-foreground">
            <div
              className="border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition p-1.5 cursor-pointer rounded-lg"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span
              onClick={handleToday}
              className="font-semibold tracking-tight cursor-pointer border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition py-1 text-sm px-6 rounded-lg flex-1 text-center"
            >
              Today
            </span>
            <div
              className="border hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition p-1.5 cursor-pointer rounded-lg"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="space-y-2 h-full">
          {calendarMode === "month" ? (
            <EventMonthView sessionId={sessionId} />
          ) : (
            <EventWeekView sessionId={sessionId} />
          )}
        </div>
      </div>
    </div>
  );
};
