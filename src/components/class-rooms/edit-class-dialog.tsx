"use client";
import { useState } from "react";
import { SectionType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassEditForm } from "./class-edit-form";
import { MemberEditForm } from "./member-edit-form";

type EditClassDialogProps = {
  containerId: string;
  classroomName: string; //id of either classroom or membership
  isOpen: boolean;
  sectionType: SectionType;
  sectionId: string;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditClassDialog = ({
  containerId,
  classroomName,
  sectionId,
  setIsEditOpen,
  sectionType,
  isOpen,
}: EditClassDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsEditOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsEditOpen(open);
  };

  const dialogDescription =
    sectionType === "CREATION"
      ? "Edit this section to quickly organize your classrooms"
      : "This name will only be visible to you";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {sectionType === "CREATION" ? (
          <ClassEditForm
            sectionId={sectionId}
            closeModal={closeModal}
            classroomId={containerId}
            classroomName={classroomName}
          />
        ) : (
          <MemberEditForm
            sectionId={sectionId}
            closeModal={closeModal}
            membershipId={containerId}
            classroomName={classroomName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
