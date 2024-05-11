import { cn } from "@/lib/utils";
import { CalendarMode } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

export const EventSkeleton = ({
  length = 5,
  mode,
}: {
  length?: number;
  mode: CalendarMode;
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-xl border py-2 shadow-md px-4 tracking-tight space-y-2",
            {
              "rounded-lg px-2 py-1": mode === "month",
            }
          )}
        >
          <Skeleton
            className={cn("h-3 w-1/2", { "w-3/4": mode === "month" })}
          />
          {mode === "week" && <Skeleton className="h-3 w-full" />}
        </div>
      ))}
    </div>
  );
};
