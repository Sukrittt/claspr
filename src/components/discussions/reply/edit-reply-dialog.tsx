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
import { EditReplyForm } from "./edit-reply-form";

type EditReplyDialogProps = {
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  replyId: string;
  replyText: string;
  discussionId: string;
  discussionType: DiscussionType;
  isReplyToReply?: boolean;
};

export const EditReplyDialog = ({
  isOpen,
  setIsEditOpen,
  replyText,
  discussionId,
  discussionType,
  isReplyToReply = false,
  replyId,
}: EditReplyDialogProps) => {
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
          <DialogTitle>Edit reply</DialogTitle>
          <DialogDescription>
            Your reply will be marked as edited.
          </DialogDescription>
        </DialogHeader>

        <EditReplyForm
          closeModal={closeModal}
          replyId={replyId}
          isReplyToReply={isReplyToReply}
          discussionId={discussionId}
          initialText={replyText}
          discussionType={discussionType}
        />
      </DialogContent>
    </Dialog>
  );
};
