import { Skeleton } from "@/components/ui/skeleton";

export const TitleInputSkeleton = () => {
  return (
    <div className="w-full space-y-1">
      <p className="text-[14px] font-medium tracking-tight">Title</p>
      <div className="flex items-center gap-x-2 w-full">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};
