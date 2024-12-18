import { MessageCircleOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClearConversation } from "@/hooks/conversation";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClearConversationProps {
  classroomId: string;
  disabled: boolean;
}

export const ClearConversation: React.FC<ClearConversationProps> = ({
  classroomId,
  disabled,
}) => {
  const { mutate: clearConversation } = useClearConversation();

  return (
    <CustomTooltip text="Clear Conversation">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 text-muted-foreground"
        disabled={disabled}
        onClick={() => clearConversation({ classroomId })}
      >
        <MessageCircleOff className="w-4 h-4 cursor-pointer" />
      </Button>
    </CustomTooltip>
  );
};
