import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AnnouncementSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="w-full space-y-4">
        {Array.from({ length }).map((_, i) => (
          <AnnouncementSkeletonCard key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};

const AnnouncementSkeletonCard = () => {
  return (
    <div className="bg-neutral-200 hover:bg-neutral-300/70 transition-all text-sm rounded-lg py-4 px-3 flex items-center gap-x-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1 w-full">
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-1/3" />

          <Skeleton className="h-4 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
