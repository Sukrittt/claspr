import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Conversation, FEEDBACK_STATUS } from "@prisma/client";

import { useGiveFeedback } from "@/hooks/conversation";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

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

  if (conversation.feedback) {
    if (conversation.feedback === "LIKE") {
      return (
        <CustomTooltip text="You gave a like to this conversation">
          <div
            className="p-1.5 rounded-md bg-neutral-200"
            onClick={() => handleGiveFeedback("LIKE")}
          >
            <ThumbsUp className="w-3 h-3 stroke-neutral-800" />
          </div>
        </CustomTooltip>
      );
    } else {
      return (
        <CustomTooltip text="You gave a dislike to this conversation">
          <div
            className="p-1.5 rounded-md bg-neutral-200"
            onClick={() => handleGiveFeedback("DISLIKE")}
          >
            <ThumbsDown className="w-3 h-3 stroke-neutral-800" />
          </div>
        </CustomTooltip>
      );
    }
  }

  return (
    <>
      <CustomTooltip text="Like">
        <ThumbsUp
          className="w-3 h-3"
          onClick={() => handleGiveFeedback("LIKE")}
        />
      </CustomTooltip>
      <CustomTooltip text="Dislike">
        <ThumbsDown
          className="w-3 h-3"
          onClick={() => handleGiveFeedback("DISLIKE")}
        />
      </CustomTooltip>
    </>
  );
};
