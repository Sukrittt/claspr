import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Info,
  Link,
  MoreHorizontal,
  NotebookText,
  Pen,
  SendToBack,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedFolder, MinifiedNote } from "@/types";
import { EditNoteDialog } from "./mutations/edit-note-dialog";
import { NoteInfoDialog } from "./mutations/note-info-dialog";
import { MoveNoteDialog } from "./mutations/move-note-dialog";
import { DeleteNoteDialog } from "./mutations/delete-note-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface NoteDropdownProps {
  note: MinifiedNote;
  folders: ExtendedFolder[];
  disabled?: boolean;
  setActiveFolderId?: (folderId: string) => void;
}

export const NoteDropdown: React.FC<NoteDropdownProps> = ({
  note,
  folders,
  disabled = false,
  setActiveFolderId,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isLinkClasroomOpen, setIsLinkClasroomOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);

  //This is just a workaround to prevent dropdown drag event to be propogated.
  //Note. stopPropagation() does NOT work here.
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "DUMMY",
  });

  return (
    <div {...attributes} {...listeners} ref={setNodeRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 hover:bg-neutral-300 p-1 rounded-md transition">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsMoveOpen(true)}
          >
            <SendToBack className="h-3.5 w-3.5 mr-2" />
            Move
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsLinkClasroomOpen(true)}
          >
            <Link className="h-3.5 w-3.5 mr-2" />
            Link classroom
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsAddTopicOpen(true)}
          >
            <NotebookText className="h-3.5 w-3.5 mr-2" />
            Add topics
          </DropdownMenuItem>

          {!disabled && (
            <DropdownMenuItem
              className="text-gray-700 text-[13px]"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsInfoOpen(true)}
          >
            <Info className="h-3.5 w-3.5 mr-2" />
            About
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isMoveOpen && (
        <MoveNoteDialog
          note={note}
          isOpen={isMoveOpen}
          setIsMoveOpen={setIsMoveOpen}
          folders={folders}
          setActiveFolderId={setActiveFolderId}
        />
      )}
      {isEditOpen && (
        <EditNoteDialog
          note={note}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && !disabled && (
        <DeleteNoteDialog
          note={note}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
      {isInfoOpen && (
        <NoteInfoDialog
          note={note}
          isOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      )}
    </div>
  );
};
