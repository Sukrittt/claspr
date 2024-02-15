import { useState } from "react";
import { Info, MoreHorizontal, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MinifiedConversation } from "@/types";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { InfoConversationDialog } from "./conversation-info-dialog";
import { DeleteConversationDialog } from "./delete-conversation-dialog";

interface ConversationDropdownProps {
  conversation: MinifiedConversation;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConversationDropdown: React.FC<ConversationDropdownProps> = ({
  conversation,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={(val) => setIsDropdownOpen(val)}
      >
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 hover:bg-neutral-400/30 p-1 rounded-md transition cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40 mr-2">
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsInfoOpen(true)}
          >
            <Info className="h-3.5 w-3.5 mr-2" />
            Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isInfoOpen && (
        <InfoConversationDialog
          conversation={conversation}
          isOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      )}

      {isDeleteOpen && (
        <DeleteConversationDialog
          classroomId={conversation.classRoomId as string} //deletion is only allowed for the conversation inside a classroom
          conversationId={conversation.id}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
