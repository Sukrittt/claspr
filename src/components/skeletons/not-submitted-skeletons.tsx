import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotSubmittedMembersSkeleton = ({
  length = 10,
}: {
  length?: number;
}) => {
  return (
    <ScrollArea className="h-[70vh]">
      <div className="flex flex-col gap-y-2">
        {Array.from({ length }).map((_, index) => (
          <NotSubmittedMemberCard key={index} />
        ))}
      </div>
    </ScrollArea>
  );
};

const NotSubmittedMemberCard = () => {
  return (
    <div className="flex items-center justify-between border-b text-sm px-3 py-2 w-full">
      <div className="flex items-center gap-x-4 w-full">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="space-y-1 w-full">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-5 w-5 rounded-md" />
    </div>
  );
};
