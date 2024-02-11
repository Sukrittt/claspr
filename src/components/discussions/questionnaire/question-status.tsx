import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetIsAnswered } from "@/hooks/discussion";

export const QuestionStatus = ({ discussionId }: { discussionId: string }) => {
  const { data: isAnswered, isLoading } = useGetIsAnswered({ discussionId });

  return isLoading ? (
    <Skeleton className="h-3 w-10" />
  ) : (
    <span
      className={cn("font-medium", {
        "text-green-600": isAnswered,
      })}
    >
      • {isAnswered ? "Answered" : "Unanswered"}
    </span>
  );
};
