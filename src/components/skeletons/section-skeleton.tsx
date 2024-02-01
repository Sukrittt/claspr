import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export const SectionSkeleton = ({ length = 8 }: { length?: number }) => {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="flex items-center gap-x-1 px-2">
          <ChevronRight className="w-4 h-4 text-gray-800" />
          <div className="flex items-center gap-x-2 w-full">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
