import { format } from "date-fns";
import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ReplyInput } from "./reply-input";
import { ReplyDropdown } from "./reply-dropdown";
import { UserAvatar } from "@/components/custom/user-avatar";
import { ExtendedDetailedReply, ExtendedReply } from "@/types";
import { ReactionLists } from "@/components/discussions/discussion/reaction-lists";
import { ToggleAnswerSelection } from "@/components/discussions/questionnaire/toggle-answer-selection";

interface RepliesProps {
  replies: ExtendedDetailedReply[];
  session: Session;
  discussionId: string;
  discussionType: DiscussionType;
  discussionOwnerId: string;
}

export const Replies: React.FC<RepliesProps> = ({
  replies,
  session,
  discussionId,
  discussionType,
  discussionOwnerId,
}) => {
  const alreadyAnswered = replies.some((reply) => {
    const isReplyToReplySelected = reply.replies.some(
      (reply) => reply.selected
    );

    return reply.selected || isReplyToReplySelected;
  });

  return (
    <div className="flex flex-col gap-y-4">
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          session={session}
          discussionId={discussionId}
          discussionType={discussionType}
          discussionOwnerId={discussionOwnerId}
          alreadyAnswered={alreadyAnswered}
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
  discussionOwnerId: string;
  alreadyAnswered: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  session,
  discussionId,
  discussionType,
  discussionOwnerId,
  alreadyAnswered,
}) => {
  return (
    <div>
      <div
        className={cn("border rounded-md space-y-2", {
          "border-2 border-green-400":
            reply.selected && discussionType === "questionnaires",
        })}
      >
        <div className="p-4 pb-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2 text-[13px] pb-2">
              <UserAvatar user={reply.creator} className="h-6 w-6" />

              <p className="text-muted-foreground">
                <span className="font-semibold text-neutral-800 dark:text-foreground">
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

          <p className="text-neutral-800 dark:text-foreground text-sm">
            {reply.text}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground tracking-tight">
            <div className="flex items-center gap-x-4">
              {discussionType === "questionnaires" &&
                discussionOwnerId === session.user.id && (
                  <ToggleAnswerSelection
                    replyId={reply.id}
                    discussionId={discussionId}
                    discussionType={discussionType}
                    alreadyAnswered={alreadyAnswered}
                    isSelected={reply.selected}
                  />
                )}

              <ReactionLists
                discussionId={discussionId}
                replyId={reply.id}
                reactions={reply.reactions}
                session={session}
              />
            </div>

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
                  alreadyAnswered={alreadyAnswered}
                  discussionOwnerId={discussionOwnerId}
                />
                <div
                  className={cn(
                    "h-full w-[2px] bg-neutral-200 dark:bg-neutral-800 absolute top-6 left-[11px]",
                    {
                      "bg-green-300":
                        reply.selected && discussionType === "questionnaires",
                    }
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <ReplyInput discussionId={reply.discussionId} replyId={reply.id} />
      </div>
      {reply.selected && discussionType === "questionnaires" && (
        <span className="text-green-600 text-xs tracking-tight pt-2 px-4">
          Answer selected by{" "}
          {discussionOwnerId === session.user.id ? "You" : session.user.name}
        </span>
      )}
    </div>
  );
};

interface ReplyToReplyCardProps {
  reply: ExtendedReply;
  session: Session;
  discussionId: string;
  discussionType: DiscussionType;
  discussionOwnerId: string;
  alreadyAnswered: boolean;
}

const ReplyToReplyCard: React.FC<ReplyToReplyCardProps> = ({
  reply,
  session,
  discussionId,
  discussionType,
  alreadyAnswered,
  discussionOwnerId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-2 text-[13px]">
          <UserAvatar user={reply.creator} className="h-6 w-6" />
          <div className="space-y-4">
            <p className="text-muted-foreground">
              <span className="font-semibold text-neutral-800 dark:text-foreground">
                {reply.creator.name}
              </span>{" "}
              on {format(reply.createdAt, "MMM d, yyyy")}
            </p>

            <p className="text-neutral-800 dark:text-foreground text-sm">
              {reply.text}
            </p>

            <div className="flex items-center gap-x-4 text-xs text-muted-foreground tracking-tight">
              {discussionType === "questionnaires" &&
                discussionOwnerId === session.user.id && (
                  <ToggleAnswerSelection
                    replyId={reply.id}
                    discussionId={discussionId}
                    discussionType={discussionType}
                    alreadyAnswered={alreadyAnswered}
                    isSelected={reply.selected}
                    isReplyToReply
                  />
                )}
              <ReactionLists
                replyId={reply.id}
                discussionId={discussionId}
                reactions={reply.reactions}
                session={session}
              />
            </div>
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
