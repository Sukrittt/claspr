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
      <div className="flex flex-col gap-y-2">
        {Array.from({ length }).map((_, index) => (
          <SubmissionDetailCard key={index} />
        ))}
      </div>
    </ScrollArea>
  );
};

const SubmissionDetailCard = () => {
  return (
    <div className="flex items-center gap-x-4 border-b text-sm px-3 py-2 cursor-pointer hover:bg-neutral-100 transition">
      <Skeleton className="h-8 w-8 rounded-md" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="h-3 w-[28%]" />
        <div className="flex items-center gap-x-2.5">
          <Skeleton className="h-3 w-36" />
          <Separator orientation="vertical" className="h-5" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
    </div>
  );
};