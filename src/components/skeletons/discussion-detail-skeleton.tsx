import { Smile } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const DiscussionDetailSkeleton = ({
  replies = 4,
}: {
  replies?: number;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>

      <div className="border rounded-md space-y-4">
        <div className="p-4 space-y-4 pb-0">
          <div className="flex items-center gap-x-2 text-[13px] pb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />

            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground tracking-tight">
            <div className="flex items-center gap-x-2">
              <div className="border p-1 rounded-full cursor-pointer">
                <Smile className="h-4 w-4 text-neutral-800 dark:text-foreground" />
              </div>

              <ReactionListSkeleton />
            </div>

            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="p-2 border-t">
          <Skeleton className="h-7 w-full" />
        </div>
      </div>

      <div className="pb-20 space-y-4">
        {Array.from({ length: replies }).map((_, i) => (
          <ReplySkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

const ReplySkeleton = () => {
  return (
    <div className="border rounded-md space-y-2">
      <div className="p-4 pb-2 space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2 text-[13px] pb-2 w-full">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          <Skeleton className="h-4 w-4 rounded-md" />
        </div>

        <Skeleton className="h-4 w-1/2" />

        <div className="flex items-center justify-between text-xs text-muted-foreground tracking-tight">
          <div className="flex items-center gap-x-2">
            <div className="border p-1 rounded-full cursor-pointer">
              <Smile className="h-4 w-4 text-neutral-800 dark:text-foreground" />
            </div>
            <ReactionListSkeleton />
          </div>

          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      <div className="border-t p-4 flex flex-col gap-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-x-2 text-[13px] w-full">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />

                    <div className="border w-fit p-1 rounded-full cursor-pointer">
                      <Smile className="h-4 w-4 text-neutral-800 dark:text-foreground" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-4 w-4 rounded-md" />
              </div>
            </div>
            <div className="h-full w-[2px] bg-neutral-200 dark:bg-neutral-800 absolute top-6 left-[11px]" />
          </div>
        ))}
      </div>

      <div className="p-2 border-t">
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
};

const ReactionListSkeleton = ({ length = 4 }: { length?: number }) => {
  return (
    <div className="flex items-center gap-x-2">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-10" />
      ))}
    </div>
  );
};
