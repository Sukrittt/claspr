import { useState } from "react";
import { DiscussionType } from "@prisma/client";
import { MoreHorizontal, Pen, SendToBack, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { MoveDiscussionDialog } from "./dialog/move-discussion-dialog";
import { EditDiscussionDialog } from "./dialog/edit-discussion-dialog";
import { DeleteDiscussionDialog } from "./dialog/delete-discussion-dialog";

interface DiscussionDropdownProps {
  discussionId: string;
  discussionContent: any;
  discussionType: DiscussionType;
  classroomId: string;
}

export const DiscussionDropdown: React.FC<DiscussionDropdownProps> = ({
  discussionContent,
  discussionId,
  discussionType,
  classroomId,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 hover:bg-neutral-200 cursor-pointer p-1 rounded-md transition">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsMoveOpen(true)}
          >
            <SendToBack className="h-3.5 w-3.5 mr-2" />
            Move
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <EditDiscussionDialog
          discussionType={discussionType}
          discussionId={discussionId}
          discussionContent={discussionContent}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && (
        <DeleteDiscussionDialog
          classroomId={classroomId}
          discussionType={discussionType}
          discussionId={discussionId}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
      {isMoveOpen && (
        <MoveDiscussionDialog
          classroomId={classroomId}
          discussionType={discussionType}
          discussionId={discussionId}
          isOpen={isMoveOpen}
          setIsMoveOpen={setIsMoveOpen}
        />
      )}
    </>
  );
};
