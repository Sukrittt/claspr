"use client";

import { Matcher } from "react-day-picker";
import { useEffect, useState } from "react";
import { endOfHour, format, isSameDay } from "date-fns";
import { CalendarCheck, Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";

interface DatePickerProps {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  disabled?: Matcher[];
  placeholder?: string;
  disableTimePicker?: boolean;
  className?: string;
}

export function DatePicker({
  setValue,
  value,
  disabled,
  disableTimePicker = false,
  placeholder,
  className,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (!date) return;

    const today = new Date();
    const nearestHour = endOfHour(today);
    const changeofDay = !!(value && !isSameDay(date, value));

    if (isSameDay(date, today) && (!value || changeofDay)) {
      setValue(nearestHour);
    } else {
      setValue(date);
    }
  }, [date, setValue]);

  useEffect(() => {
    if (date) return;

    setDate(value);
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-center text-left font-normal h-8 text-xs gap-x-2 w-full",
            !date && "text-muted-foreground",
            !placeholder && "w-fit h-9"
          )}
        >
          {placeholder ? (
            <>
              <CalendarIcon className="h-4 w-4" />
              {value ? (
                format(new Date(value), "MMMM do, h:mm a")
              ) : (
                <span className="pt-px">{placeholder}</span>
              )}
            </>
          ) : (
            <>
              {value ? (
                <CalendarCheck className="h-4 w-4" />
              ) : (
                <CalendarIcon className="h-4 w-4" />
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 relative">
        <div
          className={cn(
            "absolute -top-60 -left-40 border py-1 bg-popover shadow-md rounded-md",
            className
          )}
        >
          <Calendar
            mode="single"
            today={value || new Date()}
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={disabled}
          />
          {!disableTimePicker && (
            <TimePicker setDate={setDate} date={value ?? date} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
