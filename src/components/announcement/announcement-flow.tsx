import { useAtom } from "jotai";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { ClassRoom } from "@prisma/client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/Editor";
import { AnnouncementForm } from "./announcement-form";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { useCreateAnnouncement } from "@/hooks/announcement";
import { ContainerHeightVariants, ContainerVariants } from "@/lib/motion";
import { SubmissionStatus } from "@/components/submission/submission-status";

export type AnnouncementStep = "title-input" | "content-input";

interface AnnouncementFlowProps {
  classroom: ClassRoom;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const AnnouncementFlow: React.FC<AnnouncementFlowProps> = ({
  classroom,
  setStepNumber,
}) => {
  const [step, setStep] = useState<AnnouncementStep>("title-input");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);

  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: createAnnouncement, isLoading } = useCreateAnnouncement();

  const handleCreateAnnouncement = () => {
    if (!date) {
      toast.error("Please select a due date for this assignment.");
      return;
    }

    if (!content) {
      toast.error("Please provide some instructions for better understanding.");
      return;
    }

    createAnnouncement({
      classRoomId: classroom.id,
      title,
      content,
      dueDate: date,
      lateSubmission: allowLateSubmission,
    });

    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleCreateAnnouncement();
    }
  }, [isSubmitting]);

  const getCurrentStepNumber = () => {
    switch (step) {
      case "title-input":
        return 1;
      case "content-input":
        return 2;
      default:
        return 1;
    }
  };

  useEffect(() => {
    setStepNumber(getCurrentStepNumber());
  }, [step]);

  const goToPrevStep = () => {
    switch (step) {
      case "title-input":
        break;
      case "content-input":
        setStep("title-input");
        break;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6">
      {step === "title-input" && (
        <AnnouncementForm title={title} setTitle={setTitle} setStep={setStep} />
      )}

      {step === "content-input" && (
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerHeightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-y-4"
          >
            <Editor title={title} classroom={classroom} />
            <SubmissionStatus
              date={date}
              setDate={setDate}
              allowLateSubmission={allowLateSubmission}
              setAllowLateSubmission={setAllowLateSubmission}
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div
        className={cn(
          "flex items-center justify-between text-xs text-muted-foreground transition-all",
          {
            "pb-5": step === "content-input",
          }
        )}
      >
        {step !== "title-input" && (
          <span
            className="hover:underline underline-offset-4 cursor-pointer hover:text-neutral-500 transition"
            onClick={goToPrevStep}
          >
            Go Back
          </span>
        )}

        {step === "content-input" && (
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Button
              disabled={isLoading}
              onClick={() => setIsSubmitting(true)}
              className="h-7 text-[11px]"
            >
              {isLoading ? (
                <Loader className="h-3 w-8 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
