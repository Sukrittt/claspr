import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ConversationSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[400px]">
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
    <div className="bg-neutral-100 shadow-none border border-border relative rounded-lg overflow-hidden">
      <div className="bg-neutral-200 px-6 py-3">
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="py-3 px-6 text-gray-800 text-[15px] space-y-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    </div>
  );
};
