import { toast } from "sonner";
import { format } from "date-fns";
import { Session } from "next-auth";
import { MoreHorizontal } from "lucide-react";
import { DiscussionType } from "@prisma/client";

import { ReplyInput } from "./reply-input";
import { ReplyDropdown } from "./reply-dropdown";
import { UserAvatar } from "@/components/custom/user-avatar";
import { ExtendedDetailedReply, ExtendedReply } from "@/types";
import { ReactionLists } from "@/components/discussions/discussion/reaction-lists";

interface RepliesProps {
  replies: ExtendedDetailedReply[];
  session: Session;
  discussionId: string;
  discussionType: DiscussionType;
}

export const Replies: React.FC<RepliesProps> = ({
  replies,
  session,
  discussionId,
  discussionType,
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          session={session}
          discussionId={discussionId}
          discussionType={discussionType}
        />
      ))}
    </div>
  );
};

interface ReplyCardProps {
  reply: ExtendedDetailedReply;
  session: Session;
  discussionId: string;
  discussionType: DiscussionType;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  session,
  discussionId,
  discussionType,
}) => {
  return (
    <div className="border rounded-md space-y-2">
      <div className="p-4 pb-2 space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2 text-[13px] pb-2">
            <UserAvatar user={reply.creator} className="h-6 w-6" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-neutral-800">
                {reply.creator.name}
              </span>{" "}
              on {format(reply.createdAt, "MMM d, yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            {reply.isEdited && (
              <span className="text-muted-foreground text-xs tracking-tight">
                edited
              </span>
            )}

            {reply.creatorId === session.user.id && (
              <ReplyDropdown
                replyId={reply.id}
                replyText={reply.text}
                discussionId={discussionId}
                discussionType={discussionType}
              />
            )}
          </div>
        </div>

        <p className="text-neutral-800 text-sm">{reply.text}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground tracking-tight">
          <ReactionLists
            replyId={reply.id}
            reactions={reply.reactions}
            session={session}
          />

          <span>
            {reply.replies.length}{" "}
            {reply.replies.length === 1 ? "reply" : "replies"}
          </span>
        </div>
      </div>

      {reply.replies.length > 0 && (
        <div className="border-t p-4 flex flex-col gap-y-4">
          {reply.replies.map((reply) => (
            <div key={reply.id} className="relative">
              <ReplyToReplyCard
                reply={reply}
                session={session}
                discussionId={discussionId}
                discussionType={discussionType}
              />
              <div className="h-full w-[2px] bg-neutral-200 absolute top-6 left-[11px]" />
            </div>
          ))}
        </div>
      )}

      <ReplyInput discussionId={reply.discussionId} replyId={reply.id} />
    </div>
  );
};

interface ReplyToReplyCardProps {
  reply: ExtendedReply;
  session: Session;
  discussionId: string;
  discussionType: DiscussionType;
}

const ReplyToReplyCard: React.FC<ReplyToReplyCardProps> = ({
  reply,
  session,
  discussionId,
  discussionType,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-2 text-[13px]">
          <UserAvatar user={reply.creator} className="h-6 w-6" />
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <span className="font-semibold text-neutral-800">
                {reply.creator.name}
              </span>{" "}
              on {format(reply.createdAt, "MMM d, yyyy")}
            </p>

            <p className="text-neutral-800 text-sm">{reply.text}</p>

            <ReactionLists
              replyId={reply.id}
              reactions={reply.reactions}
              session={session}
            />
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          {reply.isEdited && (
            <span className="text-muted-foreground text-xs tracking-tight">
              edited
            </span>
          )}

          {reply.creatorId === session.user.id && (
            <ReplyDropdown
              replyId={reply.id}
              replyText={reply.text}
              discussionId={discussionId}
              discussionType={discussionType}
              isReplyToReply
            />
          )}
        </div>
      </div>
    </div>
  );
};
