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
import { ExtendedEvent } from "@/types";
import { EditEventForm } from "@/components/event/form/edit-event-form";

type EditEventDialogProps = {
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event: ExtendedEvent;
};

export const EditEventDialog = ({
  isOpen,
  setIsEditOpen,
  event,
}: EditEventDialogProps) => {
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
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit the event details and save the changes.
          </DialogDescription>
        </DialogHeader>
        <EditEventForm event={event} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
};
