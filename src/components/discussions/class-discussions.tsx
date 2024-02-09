import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import { tabs } from "./discusion-tabs";
import { Discussions } from "./discussion";
import { ExtendedClassroomDetails } from "@/types";
import { Separator } from "@/components/ui/separator";
import { CreateDiscussionDialog } from "./discussion/create-discussion-dialog";
import { DiscussionDetails } from "./discussion/discussion-details";

interface ClassDiscussionsProps {
  classroom: ExtendedClassroomDetails;
  session: Session;
}

export const ClassDiscussions: React.FC<ClassDiscussionsProps> = ({
  classroom,
  session,
}) => {
  const params = useSearchParams();

  const activeTab =
    tabs.find((tab) => tab.value === params?.get("tab")) ?? tabs[0];

  const activeDiscussionId = params?.get("active");

  return (
    <div className="space-y-4">
      {!activeDiscussionId ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <activeTab.icon className="h-4 w-4" />
              <p className="tracking-tight text-sm font-medium">
                {activeTab.label}
              </p>
            </div>

            <CreateDiscussionDialog
              classroom={classroom}
              discussionType={activeTab.value as DiscussionType}
            />
          </div>

          <div>
            <Separator />

            <Discussions
              classroomId={classroom.id}
              discussionType={activeTab.value as DiscussionType}
              session={session}
            />
          </div>
        </div>
      ) : (
        <DiscussionDetails
          classroomId={classroom.id}
          activeDiscussionId={activeDiscussionId}
          discussionType={activeTab.value as DiscussionType}
        />
      )}
    </div>
  );
};
