import { useAtom } from "jotai";

import { calendarModeAtom } from "@/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarMode } from "@/types/event";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";

export const SwitchCalendarMode = () => {
  const mounted = useMounted();
  const [calendarMode, setCalendarMode] = useAtom(calendarModeAtom);

  return (
    <Select
      value={calendarMode}
      onValueChange={(val) => setCalendarMode(val as CalendarMode)}
    >
      <SelectTrigger className="w-full sm:w-[100px]">
        {!mounted ? (
          <Skeleton className="h-3 w-3/4" />
        ) : (
          <SelectValue placeholder="Calendar Mode" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week" className="py-1">
          Week
        </SelectItem>
        <SelectItem value="month" className="py-1">
          Month
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
