import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { ContainerHeightVariants, ContainerVariants } from "@/lib/motion";

interface SubmissionStatusProps {
  isSubmission: boolean;
  setIsSubmission: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  allowLateSubmission: boolean;
  setAllowLateSubmission: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  isSubmission,
  setIsSubmission,
  allowLateSubmission,
  setAllowLateSubmission,
  date,
  setDate,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 pt-2"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm tracking-tight text-gray-800">
            Is there a submission for this announcement?
          </h3>
          <div className="flex items-center gap-x-4">
            <div
              onClick={() => setIsSubmission(true)}
              className={cn(
                "text-xs font-medium transition-all cursor-pointer flex items-center gap-x-1 border-b-[1.5px] border-transparent",
                {
                  "text-green-600 border-green-600": isSubmission,
                }
              )}
            >
              <Check className="w-3 h-3" />
              <span>Yes</span>
            </div>
            <div
              onClick={() => setIsSubmission(false)}
              className={cn(
                "text-xs font-medium transition-all cursor-pointer flex items-center gap-x-1 border-b-[1.5px] border-transparent",
                {
                  "text-destructive border-destructive": !isSubmission,
                }
              )}
            >
              <X className="w-3 h-3" />
              <span>No</span>
            </div>
          </div>
        </div>
        <div className={cn("border border-transparent -mt-2", {})}>
          <AnimatePresence mode="wait">
            {isSubmission && (
              <motion.div
                variants={ContainerHeightVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-y-2"
              >
                <div className="flex">
                  <DatePicker
                    value={date}
                    setValue={setDate}
                    disabled={[{ before: new Date() }]}
                  />
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <Checkbox
                    checked={allowLateSubmission}
                    onCheckedChange={(val) =>
                      setAllowLateSubmission(val as boolean)
                    }
                  />
                  <h3 className="text-sm tracking-tight text-gray-800">
                    Allow late submission?
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
