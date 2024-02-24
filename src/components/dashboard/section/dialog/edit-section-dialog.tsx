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
import { SectionEditForm } from "@/components/dashboard/section/form/section-edit-form";

type EditSectionDialogProps = {
  sectionId: string;
  sectionName: string;
  isOpen: boolean;
  sectionType: SectionType;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditSectionDialog = ({
  sectionId,
  sectionName,
  setIsEditOpen,
  isOpen,
  sectionType,
}: EditSectionDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsEditOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsEditOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Edit this section to quickly organize your classrooms
          </DialogDescription>
        </DialogHeader>
        <SectionEditForm
          closeModal={closeModal}
          sectionId={sectionId}
          sectionName={sectionName}
          sectionType={sectionType}
        />
      </DialogContent>
    </Dialog>
  );
};
