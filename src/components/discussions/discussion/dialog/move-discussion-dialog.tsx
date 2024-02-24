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
import { MoveDiscussionForm } from "@/components/discussions/discussion/form/move-discussion-form";

type MoveDiscussionDialogProps = {
  isOpen: boolean;
  setIsMoveOpen: React.Dispatch<React.SetStateAction<boolean>>;
  discussionId: string;
  discussionType: DiscussionType;
  classroomId: string;
};

export const MoveDiscussionDialog = ({
  isOpen,
  setIsMoveOpen,
  discussionId,
  discussionType,
  classroomId,
}: MoveDiscussionDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsMoveOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsMoveOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Discussion</DialogTitle>
          <DialogDescription>
            Move this discussion to another category
          </DialogDescription>

          <div className="pt-4">
            <MoveDiscussionForm
              closeModal={closeModal}
              discussionId={discussionId}
              discussionType={discussionType}
              classroomId={classroomId}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
