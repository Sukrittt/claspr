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
import { ExtendedFolder, MinifiedConversation } from "@/types";

type FolderInfoDialogProps = {
  folder: ExtendedFolder;
  isOpen: boolean;
  setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FolderInfoDialog = ({
  folder,
  setIsInfoOpen,
  isOpen,
}: FolderInfoDialogProps) => {
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
            You created this folder on{" "}
            <span>
              <span className="font-semibold">
                {format(folder.createdAt, "do MMM, yyyy")}
              </span>{" "}
              and has{" "}
              <span className="font-semibold">{folder.notes.length} notes</span>{" "}
              in it.
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
