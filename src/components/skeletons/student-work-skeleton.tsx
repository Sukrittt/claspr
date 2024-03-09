import { Skeleton } from "@/components/ui/skeleton";

export const StudentWorkSkeleton = ({ length = 5 }: { length?: number }) => {
  return Array.from({ length }).map((_, i) => (
    <div key={i} className="border-b pb-2 space-y-2">
      <Skeleton className="h-4 w-3/4" />

      <div className="space-y-1">
        {Array.from({ length: length - 3 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-1/2" />
        ))}
      </div>

      <div className="flex justify-end text-[11px] pt-1 text-muted-foreground">
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  ));
};
