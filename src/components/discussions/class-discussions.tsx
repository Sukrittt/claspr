import { useSearchParams } from "next/navigation";

import { tabs } from "./discusion-tabs";
import { ExtendedClassroomDetails } from "@/types";
import { Separator } from "@/components/ui/separator";

interface ClassDiscussionsProps {
  classroom: ExtendedClassroomDetails;
}

export const ClassDiscussions: React.FC<ClassDiscussionsProps> = ({
  classroom,
}) => {
  const params = useSearchParams();

  const activeTab =
    tabs.find((tab) => tab.value === params?.get("tab")) ?? tabs[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <activeTab.icon className="h-4 w-4" />
          <p className="tracking-tight text-sm font-medium">
            {activeTab.label}
          </p>
        </div>
        <Separator />
      </div>
    </div>
  );
};
