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
import { ExtendedEvent, MinifiedNote } from "@/types";

type EventInfoDialogProps = {
  event: ExtendedEvent;
  isOpen: boolean;
  setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EventInfoDialog = ({
  event,
  setIsInfoOpen,
  isOpen,
}: EventInfoDialogProps) => {
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
            You created this event on{" "}
            <span className="font-semibold">
              {format(event.createdAt, "do MMM, yyyy")}
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
