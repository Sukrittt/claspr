import { useState } from "react";
import { SectionType } from "@prisma/client";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditSectionDialog } from "./edit-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface SectionDropdownProps {
  sectionId: string;
  sectionName: string;
  sectionType: SectionType;
  children: React.ReactNode;
}

export const SectionContextMenu: React.FC<SectionDropdownProps> = ({
  sectionId,
  sectionName,
  sectionType,
  children,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="min-w-40">
          <ContextMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="h-3.5 w-3.5 mr-2" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
