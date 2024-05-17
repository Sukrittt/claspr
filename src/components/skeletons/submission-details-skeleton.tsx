import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SubmissionDetailsSkeleton = ({
  length = 10,
}: {
  length?: number;
}) => {
  return (
    <ScrollArea className="h-[70vh]">
      <div className="flex flex-col gap-y-2 pt-2 sm:pt-0">
        {Array.from({ length }).map((_, index) => (
          <SubmissionDetailCard key={index} />
        ))}
      </div>
    </ScrollArea>
  );
};

const SubmissionDetailCard = () => {
  return (
    <div className="flex items-center justify-between border-b text-sm px-3 py-2">
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-3 w-[28%]" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-y-0 sm:gap-x-2.5">
            <Skeleton className="h-3 w-36" />
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </div>
      <Skeleton className="h-5 w-5 rounded-md" />
    </div>
  );
};
