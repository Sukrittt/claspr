import { Skeleton } from "@/components/ui/skeleton";

export const PaymentHistorySkeleton = ({
  length = 20,
}: {
  length?: number;
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-2 text-sm">
          <Skeleton className="col-span-2 h-3 w-full" />
          <Skeleton className="mx-auto h-3 w-6" />
          <Skeleton className="mx-auto h-3 w-6" />
          <Skeleton className="col-span-2 h-3 w-full" />
        </div>
      ))}
    </div>
  );
};
