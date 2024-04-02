import { UserType } from "@prisma/client";

import { FolderCards } from "@/components/folder/folder-cards";
import { UpcomingEvents } from "@/components/event/upcoming-events";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { TeacherSection } from "@/components/dashboard/section/teacher-section";
import { StudentSection } from "@/components/dashboard/section/student-section";

interface DashboardLayoutProps {
  role: UserType;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return (
    <BreadcrumbProvider breadcrumbs={[]}>
      <div className="py-8 px-4 sm:px-12 grid grid-cols-7 gap-4 h-full">
        <div className="col-span-7 lg:col-span-5">
          {role === "STUDENT" ? <StudentSection /> : <TeacherSection />}
        </div>
        <div className="col-span-7 lg:col-span-2 flex flex-col gap-y-2 h-full">
          <FolderCards />
          <div className="flex-1 pb-8 lg:pb-0">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
