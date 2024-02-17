"use client";
import { useState } from "react";
import { DiscussionType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoveNoteForm } from "./move-note-form";
import { ExtendedFolder, MinifiedNote } from "@/types";

type MoveNoteDialogProps = {
  isOpen: boolean;
  setIsMoveOpen: React.Dispatch<React.SetStateAction<boolean>>;
  note: MinifiedNote;
  folders: ExtendedFolder[];
  setActiveFolderId?: (folderId: string) => void;
};

export const MoveNoteDialog = ({
  isOpen,
  setIsMoveOpen,
  folders,
  note,
  setActiveFolderId,
}: MoveNoteDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsMoveOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsMoveOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Note</DialogTitle>
          <DialogDescription>
            Move this note to another folder
          </DialogDescription>

          <div className="pt-4">
            <MoveNoteForm
              closeModal={closeModal}
              folders={folders}
              note={note}
              setActiveFolderId={setActiveFolderId}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
