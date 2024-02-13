import { useAtom } from "jotai";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DiscussionType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/Editor";
import { ContainerHeightVariants } from "@/lib/motion";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { discussionPlaceholders } from "@/config/utils";
import { useStartDiscussion } from "@/hooks/discussion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiscussionTitleInput } from "./discussion-title-input";

interface CreateDiscussionFormProps {
  classroomId: string;
  discussionType: DiscussionType;
  closeModal: () => void;
}

export type DiscussionStep = "title-input" | "content-input";

export const CreateDiscussionForm: React.FC<CreateDiscussionFormProps> = ({
  classroomId,
  discussionType,
  closeModal,
}) => {
  const { placeholder, editorPlaceholder, btnLabel } =
    discussionPlaceholders[discussionType];

  const [step, setStep] = useState<DiscussionStep>("title-input");
  const [title, setTitle] = useState("");

  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: startDiscussion, isLoading } = useStartDiscussion({
    closeModal,
  });

  const handleStartDiscussion = () => {
    if (!content) {
      toast.error("Please provide some content for better understanding.");
      return;
    }

    startDiscussion({
      classroomId,
      title,
      content,
      discussionType,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleStartDiscussion();
    }
  }, [isSubmitting]);

  return (
    <div className="flex flex-col gap-y-4">
      {step === "title-input" && (
        <DiscussionTitleInput
          title={title}
          setTitle={setTitle}
          setStep={setStep}
          placeholder={placeholder}
        />
      )}

      <AnimatePresence mode="wait">
        {step === "content-input" && (
          <motion.div
            variants={ContainerHeightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-y-4"
          >
            <ScrollArea className="h-[50vh]" style={{ position: "static" }}>
              <Editor
                disableAI
                disableAutofocus
                placeholder={editorPlaceholder}
              />
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {step === "content-input" && (
        <div className="flex items-center justify-between">
          <span
            className="hover:underline underline-offset-4 cursor-pointer text-muted-foreground hover:text-neutral-500 transition text-sm tracking-tight"
            onClick={() => setStep("title-input")}
          >
            Go back
          </span>

          <Button
            disabled={isLoading}
            onClick={() => setIsSubmitting(true)}
            className="h-7 text-[11px]"
          >
            {isLoading ? <Loader className="h-3 w-8 animate-spin" /> : btnLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
