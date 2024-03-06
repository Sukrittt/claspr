import { AnimatePresence, motion } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { ExtendedClassroomDetails } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ClassroomSettingsForm } from "./form/class-settings-form";

export const ClassroomSettings = ({
  classroom,
}: {
  classroom: ExtendedClassroomDetails;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4"
      >
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Classroom Settings
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your classroom settings here.
          </p>
        </div>

        <Separator />

        <ClassroomSettingsForm classroom={classroom} />
      </motion.div>
    </AnimatePresence>
  );
};
