import { Skeleton } from "@/components/ui/skeleton";

export const HelpfulUsersSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-y-2 pb-6">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-neutral-200 dark:border-border py-2 px-3 w-full"
        >
          <div className="flex items-center gap-x-2 w-full">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
};
