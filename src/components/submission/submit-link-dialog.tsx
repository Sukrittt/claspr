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
import { SubmitLinkForm } from "./submit-link-form";

type SubmitLinkDialogProps = {
  isOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  announcementId: string;
};

export const SubmitLinkDialog = ({
  setIsDialogOpen,
  isOpen,
  announcementId,
}: SubmitLinkDialogProps) => {
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
          <DialogTitle>Add a link</DialogTitle>
          <DialogDescription>Attach a link to your work.</DialogDescription>
        </DialogHeader>
        <SubmitLinkForm
          announcementId={announcementId}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
};
