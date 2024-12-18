"use client";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinifiedNote } from "@/types";
import { EditNoteForm } from "@/components/note/form/edit-note-form";

type EditNoteDialogProps = {
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  note: MinifiedNote;
  classroomId?: string;
};

export const EditNoteDialog = ({
  isOpen,
  setIsEditOpen,
  note,
  classroomId,
}: EditNoteDialogProps) => {
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
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>Quickly rename this note</DialogDescription>
        </DialogHeader>
        <EditNoteForm
          note={note}
          closeModal={closeModal}
          classroomId={classroomId}
        />
      </DialogContent>
    </Dialog>
  );
};
