import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AssignmentSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[75vh]">
      <div className="w-full space-y-4">
        {Array.from({ length }).map((_, i) => (
          <AssignmentSkeletonCard key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};

const AssignmentSkeletonCard = () => {
  return (
    <div className="border-b text-sm px-3 py-2 flex items-center gap-x-2">
      <Skeleton className="h-8 w-8 rounded-md" />
      <div className="space-y-1 w-full">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-1/3" />
      </div>
    </div>
  );
};
