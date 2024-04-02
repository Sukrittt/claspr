"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, NotepadText, Speech } from "lucide-react";

import { cn } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { ExtendedAssignmentDetails } from "@/types";
import { Submissions } from "@/components/assignment/submission/submissions";
import { AssignmentFilter } from "@/components/assignment/assignment-filter";
import { AssignmentDetails } from "@/components/assignment/assignment-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentInstructions } from "@/components/assignment/assignment-instructions";
import { AssignmentOptionsDropdown } from "@/components/assignment/assignment-options-dropdown";

export type OptionType = {
  label: string;
  value: string;
  icon: JSX.Element;
};

interface TeacherViewProps {
  assignment: ExtendedAssignmentDetails;
  session: Session;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  assignment,
  session,
}) => {
  const [tabVal, setTabVal] = useState("submissions");

  const tabOptions: OptionType[] = [
    {
      label: "Submissions",
      value: "submissions",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Instructions",
      value: "instructions",
      icon: <Speech className="h-4 w-4" />,
    },
    {
      label: "Details",
      value: "details",
      icon: <NotepadText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="px-4 lg:px-20 py-8 h-full">
      <Tabs
        defaultValue="submissions"
        className="h-full"
        value={tabVal}
        onValueChange={(val) => setTabVal(val)}
      >
        <div className="flex items-center justify-between">
          {/* FOR SMALLER SCREENS */}
          <AssignmentOptionsDropdown
            tabOptions={tabOptions}
            tabValue={tabVal}
            setTabValue={setTabVal}
          />

          <TabsList className="hidden lg:block mb-2">
            {tabOptions.map((option, index) => (
              <TabsTrigger
                key={option.value}
                className={cn({ "ml-0": index === 0 })}
                value={option.value}
              >
                <div className="flex items-center gap-x-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {tabVal === "submissions" && (
              <AssignmentFilter assignment={assignment} />
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
