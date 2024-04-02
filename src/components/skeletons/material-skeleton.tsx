import { Folder } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MaterialSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      <div>
        <Separator />
        <ScrollArea className="h-[68vh]">
          {Array.from({ length }).map((_, index) => (
            <MaterialSkeletonCard key={index} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

const MaterialSkeletonCard = () => {
  return (
    <div className="border-b px-3 py-4 flex items-center justify-between">
      <div className="flex items-center gap-x-4 w-1/2">
        <Skeleton className="rounded-md h-10 w-12" />

        <div className="space-y-2 w-full">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>

      <Skeleton className="h-5 w-5" />
    </div>
  );
};

export const MaterialTabsSkeleton = ({ length = 5 }: { length?: number }) => {
  return Array.from({ length }).map((_, i) => (
    <div
      key={i}
      className="mb-2 py-1 px-2.5 flex items-center gap-x-2 rounded-md text-[13px] group"
    >
      <div className="border rounded-md p-1.5 flex items-center justify-center">
        <Folder className="h-3.5 w-3.5" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  ));
};
