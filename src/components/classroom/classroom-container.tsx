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
    <Tabs defaultValue="assignments">
      <TabsList className="mb-2">
        <TabsTrigger className="ml-0" value="assignments">
          Assignments
        </TabsTrigger>
        <TabsTrigger value="study-materials">Study Materials</TabsTrigger>
        <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="conversations">Conversations</TabsTrigger>
      </TabsList>
      <TabsContent value="assignments">
        <Announcements classroomId={classroom.id} session={session} />
      </TabsContent>
      <TabsContent value="study-materials">Study Materials</TabsContent>
      <TabsContent value="questionnaires">Questionnaires</TabsContent>
      <TabsContent value="members">
        <ClassMembers members={classroom.students} />
      </TabsContent>
      <TabsContent value="conversations">
        <ConversationHistory classroomId={classroom.id} />
      </TabsContent>
    </Tabs>
  );
};
