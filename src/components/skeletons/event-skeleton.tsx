import { Skeleton } from "@/components/ui/skeleton";

export const EventSkeleton = ({ length = 5 }: { length?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border py-2 px-4 tracking-tight space-y-2"
        >
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
};
