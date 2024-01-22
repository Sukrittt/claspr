import { Skeleton } from "@/components/ui/skeleton";

export const AiInputSkeleton = () => {
  return (
    <div className="flex items-center gap-x-2 w-full">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-[58px]" />
    </div>
  );
};
