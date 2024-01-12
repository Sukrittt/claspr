import Image from "next/image";
import { UserType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { type OnBoardStep } from "./onboard-form";

interface ChooseRoleProps {
  setRole: (role: UserType) => void;
  setStep: (step: OnBoardStep) => void;
}

export const ChooseRole: React.FC<ChooseRoleProps> = ({ setRole, setStep }) => {
  const handleRoleChange = (role: UserType) => {
    setRole(role);
    setStep("enter-university");
  };

  const roleCardClass =
    "flex flex-col gap-y-1 p-5 border border-slate-300 cursor-pointer hover:bg-slate-200 transition rounded-xl";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-10"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please choose whether you are a student or a teacher.
          </p>
        </div>
        <div className="flex items-center gap-x-8">
          <div
            className={roleCardClass}
            onClick={() => handleRoleChange("TEACHER")}
          >
            <div className="flex items-center gap-x-3">
              <Image
                className="object-cover"
                src="/teacher.png"
                width={50}
                height={50}
                alt="Teacher"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Teacher
                </h3>
                <p className="text-muted-foreground">
                  Create courses and interact with your students.
                </p>
              </div>
            </div>
          </div>
          <span className="text-muted-foreground text-sm">OR</span>
          <div
            className={roleCardClass}
            onClick={() => handleRoleChange("STUDENT")}
          >
            <div className="flex items-center gap-x-3">
              <Image src="/student.png" width={50} height={50} alt="Student" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Student
                </h3>
                <p className="text-muted-foreground">
                  Access courses and engage with your peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
