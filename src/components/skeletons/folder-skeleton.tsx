import { Folder } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const FolderSkeleton = ({ length = 5 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {Array.from({ length }).map((_, index) => (
        <FolderSkeletonCard key={index} />
      ))}
    </div>
  );
};

const FolderSkeletonCard = () => {
  return (
    <div className="flex items-center justify-between group pb-2 px-6 text-gray-800 dark:text-foreground text-sm border-b focus:outline-none">
      <div className="flex items-center gap-x-3 w-full">
        <div className="border rounded-md p-1.5">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  );
};
