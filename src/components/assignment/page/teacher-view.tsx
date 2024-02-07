"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { FileText, Speech } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ExtendedAssignment } from "@/types";
import { ContainerFilterVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Submissions } from "@/components/assignment/submission/submissions";
import { AssignmentFilter } from "@/components/assignment/assignment-filter";
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
          <ScrollArea className="h-[500px]">
            <AssignmentInstructions assignment={assignment} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
