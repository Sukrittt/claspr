import { ClassMembers } from "./class-members";
import { ExtendedClassroomDetails } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassroomContainerProps {
  classroom: ExtendedClassroomDetails;
}

export const ClassroomContainer: React.FC<ClassroomContainerProps> = ({
  classroom,
}) => {
  return (
    <Tabs defaultValue="announcements">
      <TabsList className="mb-2">
        <TabsTrigger className="ml-0" value="announcements">
          Announcements
        </TabsTrigger>
        <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="announcements">Announcements</TabsContent>
      <TabsContent value="questionnaires">Questionnaires</TabsContent>
      <TabsContent value="members">
        <ClassMembers members={classroom.students} />
      </TabsContent>
    </Tabs>
  );
};
