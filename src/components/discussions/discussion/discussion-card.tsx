import { useAtom } from "jotai";
import { format } from "date-fns";
import { Session } from "next-auth";
import { MessageSquare } from "lucide-react";

import { ExtendedDiscussion } from "@/types";
import { activeDiscussionIdAtom } from "@/atoms";
import AvatarGroup from "@/components/ui/avatar-group";
import { useQueryChange } from "@/hooks/use-query-change";
import { tabs } from "@/components/discussions/discussion-tabs";
import { QuestionStatus } from "@/components/discussions/questionnaire/question-status";

interface DiscussionCardProps {
  discussion: ExtendedDiscussion;
  session: Session;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  session,
}) => {
  const [, setActiveDiscussionId] = useAtom(activeDiscussionIdAtom);

  const discussionDetails = tabs.find(
    (tab) => tab.value === discussion.discussionType
  )!; //It will not be NULL in any case.

  const handleQueryChange = useQueryChange();

  return (
    <div className="border-b px-3 py-4 flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <div className="hidden bg-neutral-200 dark:bg-neutral-800 rounded-md h-10 w-10 sm:grid place-items-center">
          <discussionDetails.icon className="h-5 w-5" />
        </div>

        <div className="space-y-0.5">
          <h6
            className="font-medium tracking-tight text-base hover:underline underline-offset-4 transition cursor-pointer w-fit"
            onClick={() => {
              setActiveDiscussionId(discussion.id);

              const initialUrl = `/c/${discussion.classroomId}`;
              handleQueryChange(initialUrl, {
                discussion: discussion.id,
              });
            }}
          >
            {discussion.title}
          </h6>
          <div className="flex items-center gap-x-1 text-muted-foreground tracking-tight text-[13px]">
            <p>
              <span className="font-semibold">{discussion.creator.name}</span>{" "}
              created this on {format(discussion.createdAt, "MMM dd, yyyy")} in{" "}
              <span className="font-semibold">{discussionDetails.label}</span>
            </p>

            {discussion.discussionType === "questionnaires" && (
              <QuestionStatus discussionId={discussion.id} />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-8">
        <div className="hidden sm:block">
          <AvatarGroup
            data={discussion.replies.map((reply) => ({
              image: reply.creator.image,
              name: reply.creator.name,
              session,
            }))}
          />
        </div>
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span className="text-[15px]">{discussion._count.replies}</span>
        </div>
      </div>
    </div>
  );
};
