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
import { ExtendedComment } from "@/types";
import { CommentEditForm } from "./comment-edit-form";

type EditCommentDialogProps = {
  comment: ExtendedComment;
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditCommentDialog = ({
  comment,

  setIsEditOpen,
  isOpen,
}: EditCommentDialogProps) => {
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
          <DialogTitle>Edit comment</DialogTitle>
          <DialogDescription>
            This comment will be marked as edited.
          </DialogDescription>
        </DialogHeader>

        <CommentEditForm closeModal={closeModal} comment={comment} />
      </DialogContent>
    </Dialog>
  );
};
