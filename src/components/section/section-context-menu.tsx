import { useState } from "react";
import { Pen, Trash } from "lucide-react";
import { SectionType } from "@prisma/client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MarkDefault } from "./mark-default";
import { EditSectionDialog } from "./edit-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";

interface SectionDropdownProps {
  sectionId: string;
  sectionName: string;
  sectionType: SectionType;
  children: React.ReactNode;
  isDefault: boolean;
}

export const SectionContextMenu: React.FC<SectionDropdownProps> = ({
  sectionId,
  sectionName,
  sectionType,
  children,
  isDefault = false,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isDefault) return children;

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
          <ContextMenuSeparator />

          <ContextMenuItem className="text-gray-700 text-[13px]">
            <MarkDefault sectionId={sectionId} sectionType={sectionType} />
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
