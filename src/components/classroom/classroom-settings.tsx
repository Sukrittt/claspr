import { AnimatePresence, motion } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { ExtendedClassroomDetails } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeleteClassDialog } from "./dialog/class-delete-dialog";
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

        <ScrollArea className="h-[67vh]">
          <ClassroomSettingsForm classroom={classroom} />

          <div className="space-y-2 pt-2">
            <h3 className="text-base font-semibold tracking-tight">
              Danger Zone
            </h3>

            <div className="border rounded-md p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Delete this classroom</p>
                <p className="text-xs">
                  Once you delete a classroom, there is no going back. Please be
                  certain.
                </p>
              </div>

              <DeleteClassDialog
                classroomId={classroom.id}
                sectionId={classroom.sectionId}
              />
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};
