"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Matcher } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button, buttonVariants } from "@/components/ui/button";

interface DatePickerProps {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  disabled?: Matcher[];
}

export function DatePicker({ setValue, value, disabled }: DatePickerProps) {
  const [date, setDate] = useState<Date>();

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
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? (
            format(new Date(value), "PPP")
          ) : (
            <span className="pt-px">Pick a due date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          today={value || new Date()}
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
