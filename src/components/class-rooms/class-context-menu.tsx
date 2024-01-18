import { useState } from "react";
import { SectionType } from "@prisma/client";
import { Pen, Trash } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditClassDialog } from "./edit-class-dialog";
import { LeaveClassDialog } from "./leave-class-dialog";
import { DeleteClassDialog } from "./delete-class-dialog";

interface ClassContextMenuProps {
  containerId: string; //id of either classroom or membership
  classroomName: string;
  sectionType: SectionType;
  sectionId: string;
  children: React.ReactNode;
}

export const ClassContextMenu: React.FC<ClassContextMenuProps> = ({
  containerId,
  classroomName,
  children,
  sectionId,
  sectionType,
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
