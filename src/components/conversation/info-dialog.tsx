"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Conversation } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type InfoConversationDialogProps = {
  conversation: Conversation;
  isOpen: boolean;
  setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InfoConversationDialog = ({
  conversation,
  setIsInfoOpen,
  isOpen,
}: InfoConversationDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsInfoOpen(false);
  };

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
            You had this conversation with our AI on{" "}
            <span className="font-semibold">
              {format(conversation.createdAt, "do MMM, yyyy")}
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
