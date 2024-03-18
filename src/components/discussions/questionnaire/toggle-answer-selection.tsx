import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { DiscussionType } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useToggleAnswerSelection } from "@/hooks/reply";

interface ToggleAnswerSelectionProps {
  replyId: string;
  discussionId: string;
  discussionType: DiscussionType;
  isSelected: boolean | null;
  alreadyAnswered: boolean;
  isReplyToReply?: boolean;
}

export const ToggleAnswerSelection: React.FC<ToggleAnswerSelectionProps> = ({
  replyId,
  alreadyAnswered,
  isSelected,
  isReplyToReply,
  discussionId,
  discussionType,
}) => {
  const { mutate: toggleAnswerSelection } = useToggleAnswerSelection({
    discussionId,
    discussionType,
    isReplyToReply,
  });

  const handleToggleAnswerSelection = () => {
    if (alreadyAnswered && !isSelected) {
      toast.error("You can only mark one reply as answered.");
      return;
    }

    toggleAnswerSelection({ replyId });
  };

  return (
    <div
      onClick={handleToggleAnswerSelection}
      className={cn(
        "py-1 px-2 border rounded-full transition flex items-center gap-x-2 cursor-pointer",
        {
          "opacity-70 cursor-default": alreadyAnswered && !isSelected,
          "dark:hover:bg-neutral-800": isSelected,
        }
      )}
    >
      <CheckCircle2
        className={cn(
          "h-4 w-4 text-gray-200 dark:text-neutral-800 fill-muted-foreground",
          {
            "fill-green-600": isSelected,
          }
        )}
      />
      <p className="font-medium">{isSelected ? "Unmark" : "Mark"} as answer</p>
    </div>
  );
};
