import { toast } from "sonner";
import { format } from "date-fns";
import { Session } from "next-auth";
import { MoreHorizontal, Smile } from "lucide-react";

import { ReplyInput } from "./reply-input";
import { UserAvatar } from "@/components/custom/user-avatar";
import { ExtendedDetailedReply, ExtendedReply } from "@/types";
import { ReactionLists } from "@/components/discussions/discussion/reaction-lists";

interface RepliesProps {
  replies: ExtendedDetailedReply[];
  session: Session;
}

export const Replies: React.FC<RepliesProps> = ({ replies, session }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} session={session} />
      ))}
    </div>
  );
};

const ReplyCard = ({
  reply,
  session,
}: {
  reply: ExtendedDetailedReply;
  session: Session;
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

          <MoreHorizontal
            onClick={() => toast.message("Coming Soon...")}
            className="h-4 w-4 cursor-pointer text-muted-foreground"
          />
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
              <ReplyToReplyCard reply={reply} session={session} />
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
}

const ReplyToReplyCard: React.FC<ReplyToReplyCardProps> = ({
  reply,
  session,
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

        <MoreHorizontal
          onClick={() => toast.message("Coming Soon...")}
          className="h-4 w-4 cursor-pointer text-muted-foreground"
        />
      </div>
    </div>
  );
};
