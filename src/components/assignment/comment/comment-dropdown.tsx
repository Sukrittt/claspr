import { useState } from "react";
import { MoreVertical, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedComment } from "@/types";
import { EditCommentDialog } from "./dialog/comment-edit-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CommentDeleteDialog } from "./dialog/comment-delete-dialog";

interface SectionDropdownProps {
  comment: ExtendedComment;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommentDropdown: React.FC<SectionDropdownProps> = ({
  comment,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
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
              <div className="text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 p-1 rounded-md transition cursor-pointer">
                <MoreVertical className="h-3.5 w-3.5" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <>
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
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <EditCommentDialog
          comment={comment}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && (
        <CommentDeleteDialog
          commentId={comment.id}
          assignmentId={comment.assignmentId}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
