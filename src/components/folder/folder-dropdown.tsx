import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Info, MoreHorizontal, Pen, Plus, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedFolder } from "@/types";
import { EditFolderDialog } from "./mutations/edit-folder-dialog";
import { FolderInfoDialog } from "./mutations/folder-info-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { DeleteFolderDialog } from "./mutations/delete-folder-dialog";
import { CreateFolderDialog } from "./mutations/create-folder-dialog";

interface FolderDropdownProps {
  folder: ExtendedFolder;
  isNotePage?: boolean;
  setActiveFolderId?: (folderId: string) => void;
  classroomId?: string;
}

export const FolderDropdown: React.FC<FolderDropdownProps> = ({
  folder,
  isNotePage = false,
  setActiveFolderId,
  classroomId,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
          {isNotePage && (
            <DropdownMenuItem
              className="text-gray-700 text-[13px]"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Create
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
          {!isNotePage && (
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
      {isCreateOpen && (
        <CreateFolderDialog
          isNotePage={isNotePage}
          isOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
          setActiveFolderId={setActiveFolderId}
        />
      )}
      {isEditOpen && (
        <EditFolderDialog
          folderId={folder.id}
          folderName={folder.name}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          classroomId={classroomId}
        />
      )}
      {isDeleteOpen && !isNotePage && (
        <DeleteFolderDialog
          folderId={folder.id}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          classroomId={classroomId}
        />
      )}
      {isInfoOpen && (
        <FolderInfoDialog
          folder={folder}
          isOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      )}
    </div>
  );
};
