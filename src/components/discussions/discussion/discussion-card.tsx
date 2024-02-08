import { format } from "date-fns";
import { Session } from "next-auth";
import { MessageSquare } from "lucide-react";

import { ExtendedDiscussion } from "@/types";
import AvatarGroup from "@/components/ui/avatar-group";
import { tabs } from "@/components/discussions/discusion-tabs";

interface DiscussionCardProps {
  discussion: ExtendedDiscussion;
  session: Session;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  session,
}) => {
  const discussionDetails = tabs.find(
    (tab) => tab.value === discussion.discussionType
  )!; //It will bere there.

  return (
    <div className="border-b px-3 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition">
      <div className="flex items-center gap-x-4">
        <div className="bg-neutral-200 rounded-md h-10 w-10 grid place-items-center">
          <discussionDetails.icon className="h-5 w-5" />
        </div>

        <div className="space-y-0.5">
          <h6 className="font-medium tracking-tight text-base">
            {discussion.title}
          </h6>
          <p className="text-muted-foreground tracking-tight text-[13px]">
            <span className="underline underline-offset-4">
              {discussion.creator.name}
            </span>{" "}
            created this on {format(discussion.createdAt, "MMM dd, yyyy")} in{" "}
            <span className="underline underline-offset-4">
              {discussionDetails.label}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-8">
        <AvatarGroup
          data={discussion.replies.map((reply) => ({
            image: reply.creator.image,
            name: reply.creator.name,
            session,
          }))}
        />
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{discussion._count.replies}</span>
        </div>
      </div>
    </div>
  );
};
