"use client";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRemoveEvent } from "@/hooks/event";
import { useQueryChange } from "@/hooks/use-query-change";

type DeleteEventDialogProps = {
  eventId: string;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteEventDialog = ({
  eventId,
  setIsDeleteOpen,
  isOpen,
}: DeleteEventDialogProps) => {
  const [open, setOpen] = useState(isOpen);
  const handleQueryChange = useQueryChange();

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
    handleQueryChange("/calendar", { active: null });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const { mutate: removeEvent } = useRemoveEvent({ closeModal });

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently delete this event
            from your calendar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeEvent({ eventId })}
            className="pt-2"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
