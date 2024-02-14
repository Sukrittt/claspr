"use client";
import { useState } from "react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinifiedNote } from "@/types";

type NoteInfoDialogProps = {
  note: MinifiedNote;
  isOpen: boolean;
  setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NoteInfoDialog = ({
  note,
  setIsInfoOpen,
  isOpen,
}: NoteInfoDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsInfoOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Info</DialogTitle>
          <DialogDescription>
            You created this note on{" "}
            <span className="font-semibold">
              {format(note.createdAt, "do MMM, yyyy")}
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
