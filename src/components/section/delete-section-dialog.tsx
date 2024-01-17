"use client";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useState } from "react";
import { SectionType } from "@prisma/client";

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
import { createdClassSections, joinedClassSections } from "@/atoms";
import { trpc } from "@/trpc/client";

type DeleteSectionDialogProps = {
  sectionId: string;
  sectionType: SectionType;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteSectionDialog = ({
  sectionId,
  setIsDeleteOpen,
  isOpen,
  sectionType,
}: DeleteSectionDialogProps) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

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
    if (sectionType === "CREATION") {
      moveCreatedClassRoomsToDefaultSection();
    } else {
      moveJoinedClassRoomsToDefaultSection();
    }
  };

  const moveCreatedClassRoomsToDefaultSection = () => {
    setCreatedClassSections((prev) => {
      const currentSections = [...prev];

      const sectionToRemove = currentSections.find(
        (section) => section.id === sectionId
      );

      if (!sectionToRemove) return prev;

      if (sectionToRemove.classrooms.length > 0) {
        const defaultSection = currentSections.find(
          (section) => section.isDefault && section.sectionType === sectionType
        );

        if (!defaultSection) return prev;

        const classroomsToDefault = sectionToRemove.classrooms.map(
          (classroom) => {
            return {
              ...classroom,
              sectionId: defaultSection.id,
            };
          }
        );

        const newDefaultSection = {
          ...defaultSection,
          classrooms: [...defaultSection.classrooms, ...classroomsToDefault],
        };

        const defaultSectionIndex = currentSections.findIndex(
          (section) => section.id === defaultSection.id
        );

        currentSections[defaultSectionIndex] = newDefaultSection;
      }

      const newSections = currentSections.filter(
        (section) => section.id !== sectionId
      );

      return newSections;
    });
  };

  const moveJoinedClassRoomsToDefaultSection = () => {
    setJoinedClassSections((prev) => {
      const currentSections = [...prev];

      const sectionToRemove = currentSections.find(
        (section) => section.id === sectionId
      );

      if (!sectionToRemove) return prev;

      if (sectionToRemove.memberships.length > 0) {
        const defaultSection = currentSections.find(
          (section) => section.isDefault && section.sectionType === sectionType
        );

        if (!defaultSection) return prev;

        const membershipsToDefault = sectionToRemove.memberships.map(
          (membership) => {
            return {
              ...membership,
              sectionId: defaultSection.id,
            };
          }
        );

        const newDefaultSection = {
          ...defaultSection,
          memberships: [...defaultSection.memberships, ...membershipsToDefault],
        };

        const defaultSectionIndex = currentSections.findIndex(
          (section) => section.id === defaultSection.id
        );

        currentSections[defaultSectionIndex] = newDefaultSection;
      }

      const newSections = currentSections.filter(
        (section) => section.id !== sectionId
      );

      return newSections;
    });
  };

  const { mutate: deleteFolder } = trpc.section.removeSection.useMutation({
    onSuccess: () => {
      closeModal();
      handleOptimisticUpdates();
    },
    onMutate: () => {
      toast.loading("Just a moment...", { duration: 1500 });
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
            This action is irreversible. It will permanently delete this section
            and move your classrooms (if any) to your default section.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteFolder({ sectionId })}
            className="pt-2"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
