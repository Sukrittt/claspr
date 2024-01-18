import { useState } from "react";
import { SectionType } from "@prisma/client";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditClassDialog } from "./edit-class-dialog";
import { LeaveClassDialog } from "./leave-class-dialog";
import { DeleteClassDialog } from "./delete-class-dialog";
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

  return (
    <>
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={(val) => setIsDropdownOpen(val)}
      >
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="text-gray-700 hover:bg-neutral-400/70 p-1 rounded-md transition">
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
    </>
  );
};
