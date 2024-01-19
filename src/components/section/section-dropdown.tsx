import { useState } from "react";
import { SectionType } from "@prisma/client";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MarkDefault } from "./mark-default";
import { EditSectionDialog } from "./edit-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface SectionDropdownProps {
  sectionId: string;
  sectionName: string;
  isDropdownOpen: boolean;
  sectionType: SectionType;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sectionId,
  sectionName,
  sectionType,
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
              <div className="text-gray-700 hover:bg-neutral-400/70 p-1 rounded-md transition">
                <MoreHorizontal className="h-4 w-4" />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-gray-700 text-[13px]">
              <MarkDefault sectionId={sectionId} sectionType={sectionType} />
            </DropdownMenuItem>
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
      {isDeleteOpen && (
        <DeleteSectionDialog
          sectionId={sectionId}
          sectionType={sectionType}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
