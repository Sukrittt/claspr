"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserType } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ChooseRole } from "./choose-role";
import { TextVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { UniversityInput } from "./university-input";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

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
    return <LoadingScreen fullHeight />;
  }

  return (
    <div className="h-screen flex flex-col gap-y-12 items-center justify-center px-4">
      {step === "choose-role" && (
        <ChooseRole setRole={setRole} setStep={setStep} />
      )}

      {step === "enter-university" && role && <UniversityInput role={role} />}

      <div
        className={cn(
          "flex justify-center gap-x-4 lg:gap-x-0 lg:justify-between text-xs text-muted-foreground w-2/3",
          {
            "justify-between": step === "enter-university",
          }
        )}
      >
        {step === "enter-university" && (
          <span
            className="hover:underline underline-offset-4 cursor-pointer hover:text-neutral-500 transition"
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
          className="text-right"
        >
          {getCurrentStepNumber()} of 2
        </motion.span>
      </div>
    </div>
  );
};
