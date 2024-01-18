"use client";
import { toast } from "sonner";
import { useAtom } from "jotai";
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
import { createdClassSections } from "@/atoms";

type DeleteClassDialogProps = {
  sectionId: string;
  classroomId: string;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteClassDialog = ({
  sectionId,
  classroomId,
  setIsDeleteOpen,
  isOpen,
}: DeleteClassDialogProps) => {
  const [open, setOpen] = useState(isOpen);
  const [, setCreatedClassSections] = useAtom(createdClassSections);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const handleOptimisticUpdates = () => {
    setCreatedClassSections((prev) => {
      const currentSections = [...prev];

      const sectionToUpdate = currentSections.find((s) => s.id === sectionId);
      if (!sectionToUpdate) return currentSections;

      const updatedClassrooms = sectionToUpdate.classrooms.filter(
        (c) => c.id !== classroomId
      );

      const updatedSection = {
        ...sectionToUpdate,
        classrooms: updatedClassrooms,
      };

      const updatedSections = currentSections.map((s) =>
        s.id === sectionId ? updatedSection : s
      );

      return updatedSections;
    });
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
            This action is irreversible. It will permanently delete this
            classroom and all the members will lose their progress.
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
