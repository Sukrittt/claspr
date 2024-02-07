"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, NotepadText, Speech } from "lucide-react";

import { ExtendedAssignment } from "@/types";
import { ContainerFilterVariants, ContainerVariants } from "@/lib/motion";
import { Submissions } from "@/components/assignment/submission/submissions";
import { AssignmentFilter } from "@/components/assignment/assignment-filter";
import { AssignmentDetails } from "@/components/assignment/assignment-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentInstructions } from "@/components/assignment/assignment-instructions";

interface TeacherViewProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  assignment,
  session,
}) => {
  const [tabVal, setTabVal] = useState("submissions");

  return (
    <div className="px-20 py-8 h-full">
      <Tabs
        defaultValue="submissions"
        className="h-full"
        value={tabVal}
        onValueChange={(val) => setTabVal(val)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="mb-2">
            <TabsTrigger className="ml-0" value="submissions">
              <div className="flex items-center gap-x-2">
                <FileText className="w-4 h-4" />
                <span>Submissions</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="instructions">
              <div className="flex items-center gap-x-2">
                <Speech className="w-4 h-4" />
                <span>Instructions</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="details">
              <div className="flex items-center gap-x-2">
                <NotepadText className="w-4 h-4" />
                <span>Details</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {tabVal === "submissions" && (
              <motion.div
                variants={ContainerFilterVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AssignmentFilter assignment={assignment} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <TabsContent value="submissions" className="h-[85%]">
          <Submissions assignment={assignment} session={session} />
        </TabsContent>
        <TabsContent value="instructions">
          <AnimatePresence mode="wait">
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AssignmentInstructions assignment={assignment} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="details">
          <AnimatePresence mode="wait">
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AssignmentDetails assignment={assignment} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};
