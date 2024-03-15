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
import { ExtendedFolder } from "@/types";
import { FormattedNote } from "@/types/note";
import { EditNoteDialog } from "./dialog/edit-note-dialog";
import { NoteInfoDialog } from "./dialog/note-info-dialog";
import { MoveNoteDialog } from "./dialog/move-note-dialog";
import { AddTopicDialog } from "./dialog/add-topic-dialog";
import { DeleteNoteDialog } from "./dialog/delete-note-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { LinkClassroomDialog } from "./dialog/link-classroom-dialog";

interface NoteDropdownProps {
  note: FormattedNote;
  disabled?: boolean;
  folders: ExtendedFolder[];
  setActiveFolderId?: (folderId: string) => void;
  disableLinkClassroom?: boolean;
  classroomId?: string;
}

export const NoteDropdown: React.FC<NoteDropdownProps> = ({
  note,
  folders,
  disabled = false,
  setActiveFolderId,
  disableLinkClassroom = false,
  classroomId,
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
              <div className="text-gray-700 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-300 p-1 rounded-md transition">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsMoveOpen(true)}
          >
            <SendToBack className="h-3.5 w-3.5 mr-2" />
            Move
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
          {!disableLinkClassroom && (
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-300 text-[13px]"
              onClick={() => setIsLinkClasroomOpen(true)}
            >
              <Link className="h-3.5 w-3.5 mr-2" />
              Link classroom
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsAddTopicOpen(true)}
          >
            <NotebookText className="h-3.5 w-3.5 mr-2" />
            Attach topics
          </DropdownMenuItem>

          {!disabled && (
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-300 text-[13px]"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
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
          classroomId={classroomId}
        />
      )}
      {isEditOpen && (
        <EditNoteDialog
          note={note}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          classroomId={classroomId}
        />
      )}
      {isDeleteOpen && !disabled && (
        <DeleteNoteDialog
          note={note}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          classroomId={classroomId}
        />
      )}
      {isInfoOpen && (
        <NoteInfoDialog
          note={note}
          isOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      )}
      {isAddTopicOpen && (
        <AddTopicDialog
          note={note}
          isOpen={isAddTopicOpen}
          setIsAddTopicOpen={setIsAddTopicOpen}
          classroomId={classroomId}
        />
      )}
      {isLinkClasroomOpen && !disableLinkClassroom && (
        <LinkClassroomDialog
          note={note}
          isOpen={isLinkClasroomOpen}
          setIsLinkClasroomOpen={setIsLinkClasroomOpen}
        />
      )}
    </div>
  );
};
