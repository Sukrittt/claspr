import { Session } from "next-auth";

import { ClassMembers } from "./class-members";
import { ExtendedClassroomDetails } from "@/types";
import { Announcements } from "@/components/announcement/announcements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationHistory } from "@/components/conversation/conversation-history";

interface ClassroomContainerProps {
  classroom: ExtendedClassroomDetails;
  session: Session;
}

export const ClassroomContainer: React.FC<ClassroomContainerProps> = ({
  classroom,
  session,
}) => {
  return (
    <Tabs defaultValue="assignments" className="h-full">
      <TabsList className="mb-2">
        <TabsTrigger className="ml-0" value="assignments">
          Assignments
        </TabsTrigger>
        <TabsTrigger value="study-materials">Study Materials</TabsTrigger>
        <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="conversations">Conversations</TabsTrigger>
      </TabsList>
      <TabsContent value="assignments" className="h-full">
        <Announcements classroomId={classroom.id} session={session} />
      </TabsContent>
      <TabsContent className="h-full" value="study-materials">
        Study Materials
      </TabsContent>
      <TabsContent className="h-full" value="questionnaires">
        Questionnaires
      </TabsContent>
      <TabsContent className="h-full" value="members">
        <ClassMembers members={classroom.students} />
      </TabsContent>
      <TabsContent className="h-full" value="conversations">
        <ConversationHistory classroomId={classroom.id} />
      </TabsContent>
    </Tabs>
  );
};
