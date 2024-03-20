import { UserType } from "@prisma/client";

import { FolderCards } from "@/components/folder/folder-cards";
import { UpcomingEvents } from "@/components/event/upcoming-events";
import { TeacherSection } from "@/components/dashboard/section/teacher-section";
import { StudentSection } from "@/components/dashboard/section/student-section";

interface DashboardLayoutProps {
  role: UserType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return (
    <div className="py-8 px-12 grid grid-cols-7 gap-4 h-full">
      <div className="col-span-5">
        {role === "STUDENT" ? <StudentSection /> : <TeacherSection />}
      </div>
      <div className="col-span-2 flex flex-col gap-y-2 h-full">
        <FolderCards />
        <div className="flex-1">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};
