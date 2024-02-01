import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CommentSkeleton = ({ length = 6 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[170px] pb-4">
      <div className="flex flex-col gap-y-4 pt-2">
        {Array.from({ length }).map((_, i) => (
          <CommentSkeletonCard key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};

const CommentSkeletonCard = () => {
  return (
    <div className="flex gap-x-2 w-full group">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="space-y-1.5 w-full">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
};