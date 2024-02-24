"use client";

import { addDays, format } from "date-fns";
import { Matcher } from "react-day-picker";
import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface DatePickerProps {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  disabled?: Matcher[];
  showScrollArea?: boolean;
  placeholder?: string;
  disableTimePicker?: boolean;
}

export function DatePicker({
  setValue,
  value,
  disabled,
  showScrollArea = false,
  disableTimePicker = false,
  placeholder,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>();

  const tomorrow = addDays(new Date(), 1);

  useEffect(() => {
    if (!date) return;

    setValue(date);
  }, [date, setValue]);

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
      <PopoverContent className="w-auto p-0">
        <ScrollArea
          className={cn({
            "h-[300px] pr-0": showScrollArea,
          })}
        >
          <Calendar
            mode="single"
            today={value || tomorrow}
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={disabled}
          />
          {!disableTimePicker && (
            <TimePicker setDate={setDate} date={value ?? date} />
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
