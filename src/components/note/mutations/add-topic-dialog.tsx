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
import { FormattedNote } from "@/types/note";
import { AddTopicForm } from "./add-topic-form";

type AddTopicDialogProps = {
  isOpen: boolean;
  setIsAddTopicOpen: React.Dispatch<React.SetStateAction<boolean>>;
  note: FormattedNote;
  classroomId?: string;
};

export const AddTopicDialog = ({
  isOpen,
  setIsAddTopicOpen,
  note,
  classroomId,
}: AddTopicDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsAddTopicOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsAddTopicOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach Topics</DialogTitle>
          <DialogDescription>
            Attach topics to your note to make it easier to find
          </DialogDescription>
        </DialogHeader>
        <AddTopicForm
          note={note}
          closeModal={closeModal}
          classroomId={classroomId}
        />
      </DialogContent>
    </Dialog>
  );
};
