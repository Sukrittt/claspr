import { useState } from "react";
import { MoreVertical, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedComment } from "@/types";
import { EditCommentDialog } from "./comment-edit-dialog";
import { CommentDeleteDialog } from "./comment-delete-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

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
              <div className="text-neutral-500 hover:bg-neutral-400/30 p-1 rounded-md transition cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <>
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
          announcementId={comment.announcementId}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
