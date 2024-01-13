"use client";
import { UserType } from "@prisma/client";

import { StudentClasses } from "./class-rooms/student-classes";
import { TeacherClasses } from "./class-rooms/teacher-classes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardLayoutProps {
  role: UserType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return (
    <div className="pt-8 px-12 space-y-4">
      <Tabs defaultValue="classrooms">
        <TabsList className="mb-2">
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="studyMaterials">Study Materials</TabsTrigger>
        </TabsList>
        <TabsContent value="classrooms">
          {role === "STUDENT" ? <StudentClasses /> : <TeacherClasses />}
        </TabsContent>
        <TabsContent value="studyMaterials">Your study materials</TabsContent>
      </Tabs>
    </div>
  );
};
