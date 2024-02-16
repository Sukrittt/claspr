"use client";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DiscussionType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/Editor";
import { useEditDiscussion } from "@/hooks/discussion";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type EditDiscussionDialogProps = {
  isOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  discussionId: string;
  discussionContent: any;
  discussionType: DiscussionType;
};

export const EditDiscussionDialog = ({
  setIsEditOpen,
  discussionId,
  discussionContent,
  discussionType,
  isOpen,
}: EditDiscussionDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const closeModal = () => {
    setOpen(false);
    setIsEditOpen(false);
  };

  const { mutate: editContent, isLoading } = useEditDiscussion({
    discussionType,
    closeModal,
  });

  const handleCreateAssignment = () => {
    if (!content) {
      toast.error("Please provide some content for better understanding.");
      return;
    }

    editContent({
      discussionId,
      content,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleCreateAssignment();
    }
  }, [isSubmitting]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setIsEditOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[60vh]">
          <Editor
            placeholder="What's on your mind?"
            disableAI
            content={discussionContent}
          />
        </ScrollArea>

        <Button disabled={isLoading} onClick={() => setIsSubmitting(true)}>
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
