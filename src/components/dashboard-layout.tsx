"use client";
import { UserType } from "@prisma/client";

import { TeacherSection } from "@/components/dashboard/section/teacher-section";
import { StudentSection } from "@/components/dashboard/section/student-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardLayoutProps {
  role: UserType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return (
    <div className="pt-8 px-12 space-y-4">
      <Tabs defaultValue="sections">
        <TabsList className="mb-2">
          <TabsTrigger value="sections" className="ml-0">
            Sections
          </TabsTrigger>
          <TabsTrigger value="studyMaterials">Study Materials</TabsTrigger>
        </TabsList>
        <TabsContent value="sections">
          {role === "STUDENT" ? <StudentSection /> : <TeacherSection />}
        </TabsContent>
        <TabsContent value="studyMaterials">Your study materials</TabsContent>
      </Tabs>
    </div>
  );
};
