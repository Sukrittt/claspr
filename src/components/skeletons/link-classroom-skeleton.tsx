import { Skeleton } from "@/components/ui/skeleton";

export const LinkClassroomSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-2">
        <div className="border rounded-md px-2 py-1.5">
          <Skeleton className="h-4 w-3/4 " />
        </div>
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
};
