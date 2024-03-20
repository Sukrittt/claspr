"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { useRemoveFolder } from "@/hooks/folder";

type DeleteFolderDialogProps = {
  folderId: string;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classroomId?: string;
};

export const DeleteFolderDialog = ({
  folderId,
  setIsDeleteOpen,
  isOpen,
  classroomId,
}: DeleteFolderDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const { mutate: removeFolder, isLoading } = useRemoveFolder({
    closeModal,
    classroomId,
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
            This action is irreversible. It will permanently delete this folder
            with the notes (if any) inside it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => removeFolder({ folderId })}
            className="pt-2"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-[52px] animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
