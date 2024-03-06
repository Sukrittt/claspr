"use client";
import { useAtom } from "jotai";
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
import { createdClassSections } from "@/atoms";
import { Button } from "@/components/ui/button";
import { useRemoveClassroom } from "@/hooks/class";

type DeleteClassDialogProps = {
  sectionId: string;
  classroomId: string;
};

export const DeleteClassDialog = ({
  sectionId,
  classroomId,
}: DeleteClassDialogProps) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);

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

  const { mutate: deleteClassroom, isLoading } = useRemoveClassroom({
    mutations: handleOptimisticUpdates,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Delete this classroom"
          )}
        </Button>
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
