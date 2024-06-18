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
      <div className="flex h-full flex-col gap-y-12 px-10 py-8">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-8 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0">
            <h3 className="text-center text-3xl tracking-tight sm:text-left">
              {currentMonth}, {currentYear}
            </h3>
            <div className="flex items-center gap-x-2 text-neutral-700 dark:text-foreground">
              <SwitchCalendarMode />
              <CreateEventDialog>
                <div className="cursor-pointer rounded-lg border p-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60">
                  <CustomTooltip text="Create Event">
                    <Plus className="h-3.5 w-3.5" />
                  </CustomTooltip>
                </div>
              </CreateEventDialog>
              <div
                className="hidden cursor-pointer rounded-lg border p-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60 sm:block"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </div>
              <span
                onClick={handleToday}
                className="hidden flex-1 cursor-pointer rounded-lg border px-6 py-1 text-center text-sm font-semibold tracking-tight transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60 sm:block"
              >
                Today
              </span>
              <div
                className="hidden cursor-pointer rounded-lg border p-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60 sm:block"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2 text-neutral-700 dark:text-foreground sm:hidden">
            <div
              className="cursor-pointer rounded-lg border p-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </div>
            <span
              onClick={handleToday}
              className="flex-1 cursor-pointer rounded-lg border px-6 py-1 text-center text-sm font-semibold tracking-tight transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            >
              Today
            </span>
            <div
              className="cursor-pointer rounded-lg border p-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="h-full space-y-2">
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
