"use client";
import { useState } from "react";
import { Media } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MediaEditForm } from "./media-edit-form";

type EditMediaLinkProps = {
  media: Media;
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditMediaLinkDialog = ({
  setIsEditOpen,
  isOpen,
  media,
}: EditMediaLinkProps) => {
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
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>Edit the link of the media</DialogDescription>
        </DialogHeader>
        <MediaEditForm closeModal={closeModal} media={media} />
      </DialogContent>
    </Dialog>
  );
};
