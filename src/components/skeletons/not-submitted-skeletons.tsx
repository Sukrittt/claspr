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
    <div className="flex items-center gap-x-4 border-b text-sm px-3 py-2 cursor-pointer hover:bg-neutral-100 transition">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-3 w-[20%]" />
    </div>
  );
};