import { Trash } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const LinkClassroomSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <div className="border rounded-md p-1.5 w-full">
            <Skeleton className="h-4 w-3/4 " />
          </div>
          <div className="border rounded-md p-2 bg-neutral-100 dark:bg-neutral-800 transition cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800/60 dark:text-foreground">
            <Trash className="h-3 w-3" />
          </div>
        </div>
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
};
