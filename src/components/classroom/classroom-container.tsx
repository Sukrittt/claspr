import { ExtendedClassroom } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassroomContainerProps {
  classroom: ExtendedClassroom;
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
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
      </TabsList>
      <TabsContent value="announcements">Announcements</TabsContent>
      <TabsContent value="members">Members</TabsContent>
      <TabsContent value="questionnaires">Questionnaires</TabsContent>
    </Tabs>
  );
};
