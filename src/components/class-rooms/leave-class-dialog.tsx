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

type LeaveClassDialogProps = {
  isOpen: boolean;
  membershipId: string;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LeaveSectionDialog = ({
  membershipId,
  setIsDeleteOpen,
  isOpen,
}: LeaveClassDialogProps) => {
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

  const { mutate: leaveClassroom } = trpc.class.leaveClass.useMutation({
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
            This action is irreversible. It will permanently remove you from
            this class and you will lose all your progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => leaveClassroom({ membershipId })}
            className="pt-2"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
