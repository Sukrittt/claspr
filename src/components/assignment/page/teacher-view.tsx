"use client";
import { Session } from "next-auth";
import { FileText, Speech } from "lucide-react";

import { ExtendedAssignment } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { Submissions } from "@/components/assignment/submission/submissions";
import { AssignmentFilter } from "@/components/assignment/assignment-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeacherViewProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  assignment,
  session,
}) => {
  return (
    <div className="px-20 py-8">
      <Tabs defaultValue="submissions" className="h-full">
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

          <AssignmentFilter />
        </div>
        <TabsContent value="submissions">
          <Submissions assignment={assignment} session={session} />
        </TabsContent>
        <TabsContent value="instructions">
          <ScrollArea className="h-[500px]">
            <EditorOutput content={assignment.description} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
