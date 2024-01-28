import { Skeleton } from "@/components/ui/skeleton";

export const SubmissionSkeleton = ({ length = 4 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
};

export const SubmissionFooterSkeleton = () => {
  return (
    <div className="flex w-full gap-x-2 items-center">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
