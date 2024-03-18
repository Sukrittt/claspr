import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ConversationSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[67vh]">
      <div className="w-full space-y-4">
        {Array.from({ length }).map((_, i) => (
          <ConversationCardSkeleton key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};

const ConversationCardSkeleton = () => {
  return (
    <div className="rounded-md border">
      <div className="px-6 py-1.5 border-b">
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="pt-3 pb-9 px-6 text-gray-800 text-[15px] space-y-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    </div>
  );
};
