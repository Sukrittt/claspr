import { Skeleton } from "@/components/ui/skeleton";

export const EditorSkeleton = ({ length = 4 }: { length?: number }) => {
  return (
    <div className="space-y-6 pt-2">
      {Array.from({ length }).map((_, i) => (
        <ParagraphSkeleton key={i} index={i + 1} />
      ))}
    </div>
  );
};

const ParagraphSkeleton = ({ index }: { index: number }) => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton
        style={{
          width: `${index * 30}%`,
        }}
        className="h-3"
      />
    </div>
  );
};
