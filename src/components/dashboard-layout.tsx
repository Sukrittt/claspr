import { UserType } from "@prisma/client";

import { FolderCards } from "@/components/folder/folder-cards";
import { TeacherSection } from "@/components/dashboard/section/teacher-section";
import { StudentSection } from "@/components/dashboard/section/student-section";

interface DashboardLayoutProps {
  role: UserType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return (
    <div className="pt-8 px-12 grid grid-cols-7 gap-4">
      <div className="col-span-5">
        {role === "STUDENT" ? <StudentSection /> : <TeacherSection />}
      </div>
      <div className="col-span-2">
        <FolderCards />
      </div>
    </div>
  );
};
