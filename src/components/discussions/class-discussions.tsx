import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import { tabs } from "./discussion-tabs";
import { Discussions } from "./discussion";
import { Separator } from "@/components/ui/separator";
import { DiscussionDetails } from "./discussion/discussion-details";
import { CreateDiscussionDialog } from "./discussion/create-discussion-dialog";

interface ClassDiscussionsProps {
  classroomId: string;
  session: Session;
}

export const ClassDiscussions: React.FC<ClassDiscussionsProps> = ({
  classroomId,
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
              classroomId={classroomId}
              discussionType={activeTab.value as DiscussionType}
            />
          </div>

          <div>
            <Separator />

            <Discussions
              classroomId={classroomId}
              discussionType={activeTab.value as DiscussionType}
              session={session}
            />
          </div>
        </div>
      ) : (
        <DiscussionDetails
          activeDiscussionId={activeDiscussionId}
          session={session}
          discussionType={activeTab.value as DiscussionType}
        />
      )}
    </div>
  );
};
