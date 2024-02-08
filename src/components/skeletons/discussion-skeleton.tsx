import { MessageSquare } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DiscussionSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[68vh]">
      {Array.from({ length }).map((_, index) => (
        <DiscussionSkeletonCard key={index} />
      ))}
    </ScrollArea>
  );
};

const DiscussionSkeletonCard = () => {
  return (
    <div className="border-b px-3 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition">
      <div className="flex items-center gap-x-4 w-1/2">
        <Skeleton className="rounded-md h-10 w-12" />

        <div className="space-y-2 w-full">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-8">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full -ml-2" />
          <Skeleton className="h-6 w-6 rounded-full -ml-2" />
        </div>
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <Skeleton className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
