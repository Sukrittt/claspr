import { useState } from "react";
import { SectionType } from "@prisma/client";
import { useDraggable } from "@dnd-kit/core";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MarkDefault } from "./mark-default";
import { EditSectionDialog } from "./dialog/edit-section-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { DeleteSectionDialog } from "./dialog/delete-section-dialog";

interface SectionDropdownProps {
  sectionId: string;
  sectionName: string;
  isDropdownOpen: boolean;
  sectionType: SectionType;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDefault: boolean;
}

export const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sectionId,
  sectionName,
  sectionType,
  isDropdownOpen,
  setIsDropdownOpen,
  isDefault,
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
              <div className="text-gray-700 dark:text-gray-300 hover:bg-neutral-300 dark:hover:text-gray-400 dark:hover:bg-neutral-700 dark:text-foreground p-1 rounded-md transition">
                <MoreHorizontal className="h-4 w-4" />
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
            {!isDefault && (
              <>
                <DropdownMenuItem
                  className="text-gray-700 dark:text-gray-300 text-[13px]"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 text-[13px]">
                  <MarkDefault
                    sectionId={sectionId}
                    sectionType={sectionType}
                  />
                </DropdownMenuItem>
              </>
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <EditSectionDialog
          sectionId={sectionId}
          sectionName={sectionName}
          sectionType={sectionType}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && !isDefault && (
        <DeleteSectionDialog
          sectionId={sectionId}
          sectionType={sectionType}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </div>
  );
};
