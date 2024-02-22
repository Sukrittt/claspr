import { CalendarClock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const UpcomingEventSkeleton = ({ length = 4 }: { length?: number }) => {
  return Array.from({ length }).map((_, index) => (
    <div
      key={index}
      className="border-b px-4 pb-2 pt-1 flex items-center justify-between"
    >
      <div className="space-y-2 w-full">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>

      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
  ));
};
