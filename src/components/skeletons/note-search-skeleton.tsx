import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NoteSearchSkeleton = ({ length = 8 }: { length?: number }) => {
  return (
    <ScrollArea className="h-[250px]">
      <div className="flex flex-col gap-y-2">
        {Array.from({ length }).map((_, i) => (
          <NoteSearchItem key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};

const NoteSearchItem = () => {
  return (
    <div className="py-2 px-4 hover:bg-neutral-100 transition">
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-8 w-8 rounded-md" />

        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};
