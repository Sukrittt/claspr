"use client";
import { useState } from "react";
import { Media } from "@prisma/client";

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
import { useRemoveMedia } from "@/hooks/media";

type DeleteMediaDialogProps = {
  media: Media;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteMediaDialog = ({
  media,
  setIsDeleteOpen,
  isOpen,
}: DeleteMediaDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const { mutate: deleteMedia } = useRemoveMedia();

  const handleDeleteMedia = () => {
    deleteMedia({
      mediaId: media.id,
      announcementId: media.announcementId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently delete this media
            from this assignment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMedia} className="pt-2">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
