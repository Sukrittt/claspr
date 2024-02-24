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
import { MinifiedNote } from "@/types";
import { useUserClassrooms } from "@/hooks/class";
import { LinkClassroomForm } from "@/components/note/form/link-classroom-form";
import { LinkClassroomSkeleton } from "@/components/skeletons/link-classroom-skeleton";

type LinkClassroomDialogProps = {
  note: MinifiedNote;
  isOpen: boolean;
  setIsLinkClasroomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LinkClassroomDialog = ({
  note,
  setIsLinkClasroomOpen,
  isOpen,
}: LinkClassroomDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const { data: userClassrooms, isLoading } = useUserClassrooms();

  const closeModal = () => {
    setOpen(false);
    setIsLinkClasroomOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsLinkClasroomOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        {isLoading ? (
          <LinkClassroomSkeleton />
        ) : !userClassrooms || userClassrooms.length === 0 ? (
          <p>Noooo</p>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Link classroom</DialogTitle>
              <DialogDescription>
                Link a classroom to this note for easy access.
              </DialogDescription>
            </DialogHeader>

            <LinkClassroomForm
              note={note}
              closeModal={closeModal}
              userClassrooms={userClassrooms}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
