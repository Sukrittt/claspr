"use client";
import { useAtom } from "jotai";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DiscussionType } from "@prisma/client";

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
import { activeDiscussionIdAtom } from "@/atoms";
import { useRemoveDiscussion } from "@/hooks/discussion";
import { useQueryChange } from "@/hooks/use-query-change";

type DeleteDiscussionDialogProps = {
  discussionId: string;
  discussionType: DiscussionType;
  classroomId: string;
  isOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteDiscussionDialog = ({
  discussionId,
  setIsDeleteOpen,
  isOpen,
  classroomId,
  discussionType,
}: DeleteDiscussionDialogProps) => {
  const handleQueryChange = useQueryChange();
  const [, setActiveDiscussionId] = useAtom(activeDiscussionIdAtom);

  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);

    handleGoBack();
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const handleGoBack = () => {
    const initialUrl = `/c/${classroomId}`;

    handleQueryChange(initialUrl, { discussion: undefined });
    setActiveDiscussionId(null);
  };

  const { mutate: removeDiscussion, isLoading } = useRemoveDiscussion({
    closeModal,
    discussionType,
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
            This action is irreversible. It will permanently delete this
            discussion and all of its replies and reactions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => removeDiscussion({ discussionId })}
            className="pt-2"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-14 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
