import { FileText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NoteSidebarSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <div className="border px-3 py-2 rounded-md w-full">
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-6 w-7" />
      </div>

      <ScrollArea className="h-[55vh]">
        <NoteListsSkeleton />
      </ScrollArea>
    </div>
  );
};

const NoteListsSkeleton = ({ length = 15 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-md py-1 px-2 group hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition w-full"
        >
          <div className="flex items-center gap-x-2 w-full">
            <div className="border rounded-md flex items-center justify-center p-1.5 text-gray-800 dark:text-foreground">
              <FileText className="h-3.5 w-3.5" />
            </div>

            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
