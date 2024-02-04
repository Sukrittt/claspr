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
import { SubmitDocForm } from "./submit-doc-form";

type SubmitDocumentDialogProps = {
  isOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignmentId: string;
};

export const SubmitDocumentDialog = ({
  setIsDialogOpen,
  isOpen,
  assignmentId,
}: SubmitDocumentDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a document</DialogTitle>
          <DialogDescription>Attach a document to your work</DialogDescription>
        </DialogHeader>
        <SubmitDocForm closeModal={closeModal} assignmentId={assignmentId} />
      </DialogContent>
    </Dialog>
  );
};
