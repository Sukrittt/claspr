import { useAtom } from "jotai";
import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { MousePointerSquare } from "lucide-react";

import { tabs } from "./discussion-tabs";
import { Discussions } from "./discussion";
import { Separator } from "@/components/ui/separator";
import { DiscussionDetails } from "./discussion/discussion-details";
import { activeDiscussionIdAtom, activeDiscussionTabAtom } from "@/atoms";
import { CreateDiscussionDialog } from "./discussion/create-discussion-dialog";

interface ClassDiscussionsProps {
  classroomId: string;
  session: Session;
}

export const ClassDiscussions: React.FC<ClassDiscussionsProps> = ({
  classroomId,
  session,
}) => {
  const [activeDiscussionTab] = useAtom(activeDiscussionTabAtom);
  const [activeDiscussionId] = useAtom(activeDiscussionIdAtom);

  const activeTab = tabs.find((tab) => tab.value === activeDiscussionTab);

  if (!activeTab) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-y-2">
        <MousePointerSquare className="h-10 w-10 text-neutral-800" />
        <p className="text-sm text-muted-foreground">
          Select a category to start a discussion.
        </p>
      </div>
    );
  }

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
          session={session}
          classroomId={classroomId}
          activeDiscussionId={activeDiscussionId}
          discussionType={activeTab.value as DiscussionType}
        />
      )}
    </div>
  );
};
