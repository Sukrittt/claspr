import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SectionType } from "@prisma/client";
import { DoorOpen, MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditClassDialog } from "./dialog/edit-class-dialog";
import { LeaveClassDialog } from "./dialog/leave-class-dialog";
import { DeleteClassDialog } from "./dialog/delete-class-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassDropdownProps {
  containerId: string; //id of either classroom or membership
  classroomName: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionType: SectionType;
  sectionId: string;
}

export const ClassDropdown: React.FC<ClassDropdownProps> = ({
  containerId,
  classroomName,
  isDropdownOpen,
  setIsDropdownOpen,
  sectionId,
  sectionType,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //This is just a workaround to prevent dropdown drag event to be propagated.
  //Note. stopPropagation() does NOT work here.
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "DUMMY",
  });

  return (
    <div {...attributes} {...listeners} ref={setNodeRef}>
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={(val) => setIsDropdownOpen(val)}
      >
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 dark:text-gray-300 hover:bg-neutral-400/30 p-1 rounded-md transition">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40 mr-2">
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
            {sectionType === "CREATION" ? (
              <>
                <Trash className="h-3.5 w-3.5 mr-2" />
                Delete
              </>
            ) : (
              <>
                <DoorOpen className="h-3.5 w-3.5 mr-2" />
                Leave
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <EditClassDialog
          sectionType={sectionType}
          containerId={containerId}
          sectionId={sectionId}
          classroomName={classroomName}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen &&
        (sectionType === "CREATION" ? (
          <DeleteClassDialog
            classroomId={containerId}
            isOpen={isDeleteOpen}
            setIsDeleteOpen={setIsDeleteOpen}
            sectionId={sectionId}
          />
        ) : (
          <LeaveClassDialog
            membershipId={containerId}
            isOpen={isDeleteOpen}
            setIsDeleteOpen={setIsDeleteOpen}
            sectionId={sectionId}
          />
        ))}
    </div>
  );
};
