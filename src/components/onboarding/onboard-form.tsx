"use client";
import { useState } from "react";
import { UserType } from "@prisma/client";

import { ChooseRole } from "./choose-role";
import { UniversityInput } from "./university-input";

export type OnBoardStep = "choose-role" | "enter-university";

export const OnboardForm = () => {
  const [step, setStep] = useState<OnBoardStep>("choose-role");
  const [role, setRole] = useState<UserType | null>(null);
  const [university, setUniversity] = useState("");

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

        <span className="text-right w-full">{getCurrentStepNumber()} of 2</span>
      </div>
    </div>
  );
};
