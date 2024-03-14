import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const ReportSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="border rounded-md py-3 px-4 relative">
          <div className="absolute top-2 right-4">
            <Skeleton className="h-4 w-4" />
          </div>

          <div className="flex flex-col gap-y-2.5">
            <div className="flex gap-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />

              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-x-2 w-full">
                <Skeleton className="h-4 w-[15%]" />

                <Separator orientation="vertical" className="h-4" />

                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="flex items-center gap-x-2">
                <Skeleton className="h-4 w-20" />

                <Separator orientation="vertical" className="h-4" />

                <Skeleton className="h-4 w-20" />

                <Separator orientation="vertical" className="h-4" />

                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
