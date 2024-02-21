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
import { FolderEditForm } from "./edit-folder-form";

type EditFolderDialogProps = {
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
  folderName: string;
  classroomId?: string;
};

export const EditFolderDialog = ({
  isOpen,
  setIsEditOpen,
  folderId,
  folderName,
  classroomId,
}: EditFolderDialogProps) => {
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
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>Quickly rename this folder</DialogDescription>
        </DialogHeader>
        <FolderEditForm
          folderId={folderId}
          folderName={folderName}
          closeModal={closeModal}
          classroomId={classroomId}
        />
      </DialogContent>
    </Dialog>
  );
};
