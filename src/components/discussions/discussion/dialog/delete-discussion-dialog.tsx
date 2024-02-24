"use client";
import qs from "query-string";
import { useCallback, useState } from "react";
import { DiscussionType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

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
import { useRemoveDiscussion } from "@/hooks/discussion";

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
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = useState(isOpen);

  const closeModal = () => {
    setOpen(false);
    setIsDeleteOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsDeleteOpen(open);
  };

  const handleGoBack = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      active: undefined,
    };

    const url = qs.stringifyUrl(
      {
        url: `/c/${classroomId}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [params]);

  const { mutate: removeDiscussion } = useRemoveDiscussion({
    closeModal,
    goBack: handleGoBack,
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
          <AlertDialogAction
            onClick={() => removeDiscussion({ discussionId })}
            className="pt-2"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
