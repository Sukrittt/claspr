"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserType } from "@prisma/client";

import { ChooseRole } from "./choose-role";
import { TextVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { UniversityInput } from "./university-input";

export type OnBoardStep = "choose-role" | "enter-university";

export const OnboardForm = () => {
  const mounted = useMounted();
  const [step, setStep] = useState<OnBoardStep>("choose-role");
  const [role, setRole] = useState<UserType | null>(null);

  const getCurrentStepNumber = () => {
    switch (step) {
      case "choose-role":
        return 1;
      case "enter-university":
        return 2;
      default:
        return 1;
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col gap-y-12 items-center justify-center">
      {step === "choose-role" && (
        <ChooseRole setRole={setRole} setStep={setStep} />
      )}

      {step === "enter-university" && role && <UniversityInput role={role} />}

      <div className="flex justify-between text-xs text-muted-foreground w-2/3">
        {step === "enter-university" && (
          <span
            className="hover:underline underline-offset-4 cursor-pointer hover:text-neutral-500 transition w-full"
            onClick={() => setStep("choose-role")}
          >
            Go Back
          </span>
        )}

        <motion.span
          variants={TextVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-right w-full"
        >
          {getCurrentStepNumber()} of 2
        </motion.span>
      </div>
    </div>
  );
};
