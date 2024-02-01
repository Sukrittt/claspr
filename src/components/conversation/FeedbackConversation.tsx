import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Conversation, FEEDBACK_STATUS } from "@prisma/client";

import { useGiveFeedback } from "@/hooks/conversation";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { cn } from "@/lib/utils";

interface FeedbackConversationProps {
  conversation: Conversation;
}

export const FeedbackConversation: React.FC<FeedbackConversationProps> = ({
  conversation,
}) => {
  const { mutate: giveFeedback } = useGiveFeedback({
    classroomId: conversation.classRoomId,
  });

  const handleGiveFeedback = (feedback: FEEDBACK_STATUS) => {
    giveFeedback({ conversationId: conversation.id, feedback });
  };

  const FeedbackComponent = {
    LIKE: (
      <CustomTooltip
        text={
          conversation.feedback === "LIKE"
            ? "You gave a like to this conversation"
            : "Like"
        }
      >
        <div
          className={cn("p-1.5 rounded-md hover:bg-neutral-200 transition", {
            "bg-neutral-200": conversation.feedback === "LIKE",
          })}
          onClick={() => handleGiveFeedback("LIKE")}
        >
          <ThumbsUp className="w-3 h-3" />
        </div>
      </CustomTooltip>
    ),
    DISLIKE: (
      <CustomTooltip
        text={
          conversation.feedback === "DISLIKE"
            ? "You gave a dislike to this conversation"
            : "Dislike"
        }
      >
        <div
          className={cn("p-1.5 rounded-md hover:bg-neutral-200 transition", {
            "bg-neutral-200": conversation.feedback === "DISLIKE",
          })}
          onClick={() => handleGiveFeedback("DISLIKE")}
        >
          <ThumbsDown
            className="w-3 h-3"
            onClick={() => handleGiveFeedback("DISLIKE")}
          />
        </div>
      </CustomTooltip>
    ),
  };

  return !conversation.feedback ? (
    <>
      {FeedbackComponent.LIKE}
      {FeedbackComponent.DISLIKE}
    </>
  ) : (
    <>{FeedbackComponent[conversation.feedback]}</>
  );
};
