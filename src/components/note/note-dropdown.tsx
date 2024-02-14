import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Info, MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MinifiedNote } from "@/types";
import { EditNoteDialog } from "./mutations/edit-note-dialog";
import { NoteInfoDialog } from "./mutations/note-info-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { DeleteNoteDialog } from "./mutations/delete-note-dialog";

interface NoteDropdownProps {
  note: MinifiedNote;
  disabled?: boolean;
}

export const NoteDropdown: React.FC<NoteDropdownProps> = ({
  note,
  disabled = false,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
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
