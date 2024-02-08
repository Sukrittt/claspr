import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import { tabs } from "./discusion-tabs";
import { Discussions } from "./discussion";
import { ExtendedClassroomDetails } from "@/types";
import { Separator } from "@/components/ui/separator";
import { CreateDiscussionDialog } from "./discussion/create-discussion-dialog";

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

  const isDiscussionsTab =
    activeTab.value !== "questionnaires" && activeTab.value !== "polls";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <activeTab.icon className="h-4 w-4" />
            <p className="tracking-tight text-sm font-medium">
              {activeTab.label}
            </p>
          </div>

          {isDiscussionsTab && (
            <CreateDiscussionDialog
              classroom={classroom}
              discussionType={activeTab.value as DiscussionType}
            />
          )}
        </div>

        <div>
          <Separator />

          {isDiscussionsTab ? (
            <Discussions
              classroomId={classroom.id}
              discussionType={activeTab.value as DiscussionType}
              session={session}
            />
          ) : (
            <p className="text-center pt-10 text-muted-foreground text-sm">
              Coming Soon...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
