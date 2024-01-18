"use client";
import { toast } from "sonner";
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
import { trpc } from "@/trpc/client";

type DeleteClassDialogProps = {
  classroomId: string;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteSectionDialog = ({
  classroomId,
  setIsDeleteOpen,
  isOpen,
}: DeleteClassDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const handleOptimisticUpdates = () => {
    //optimistic updates
  };

  const { mutate: deleteClassroom } = trpc.class.removeClass.useMutation({
    onMutate: () => {
      closeModal();
      handleOptimisticUpdates();
    },
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently delete this class
            and all the members will lose their progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteClassroom({ classroomId })}
            className="pt-2"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
