import { useState } from "react";
import { DiscussionType } from "@prisma/client";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditReplyDialog } from "./dialog/edit-reply-dialog";
import { DeleteReplyDialog } from "./dialog/delete-reply-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ReplyDropdownProps {
  discussionType: DiscussionType;
  discussionId: string;
  isReplyToReply?: boolean;
  replyId: string;
  replyText: string;
}

export const ReplyDropdown: React.FC<ReplyDropdownProps> = ({
  replyId,
  replyText,
  discussionId,
  discussionType,
  isReplyToReply,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-md transition">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <EditReplyDialog
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          replyId={replyId}
          discussionType={discussionType}
          discussionId={discussionId}
          replyText={replyText}
          isReplyToReply={isReplyToReply}
        />
      )}
      {isDeleteOpen && (
        <DeleteReplyDialog
          replyId={replyId}
          discussionType={discussionType}
          discussionId={discussionId}
          isReplyToReply={isReplyToReply}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
