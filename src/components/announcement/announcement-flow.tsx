import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { AnnouncementForm } from "./announcement-form";
import { SubmissionStatus } from "./submission-status";

export type AnnouncementStep =
  | "title-input"
  | "content-input"
  | "ask-submission";

interface AnnouncementFlowProps {
  classroomId: string;
  setStepNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const AnnouncementFlow: React.FC<AnnouncementFlowProps> = ({
  classroomId,
  setStepNumber,
}) => {
  const [step, setStep] = useState<AnnouncementStep>("title-input");
  const [title, setTitle] = useState("");
  const [isSubmission, setIsSubmission] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);

  const getCurrentStepNumber = () => {
    switch (step) {
      case "title-input":
        return 1;
      case "content-input":
        return 2;
      case "ask-submission":
        return 3;
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
      case "ask-submission":
        setStep("content-input");
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
        <div onClick={() => setStep("ask-submission")}>Next</div>
      )}

      {step === "ask-submission" && (
        <SubmissionStatus
          date={date}
          setDate={setDate}
          allowLateSubmission={allowLateSubmission}
          setAllowLateSubmission={setAllowLateSubmission}
          isSubmission={isSubmission}
          setIsSubmission={setIsSubmission}
        />
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {step !== "title-input" && (
          <span
            className="hover:underline underline-offset-4 cursor-pointer hover:text-neutral-500 transition"
            onClick={goToPrevStep}
          >
            Go Back
          </span>
        )}

        {step === "ask-submission" && (
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Button className="h-6 text-[11px]">Create</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
