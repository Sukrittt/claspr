import { toast } from "sonner";
import { format } from "date-fns";
import { MoreHorizontal, Smile } from "lucide-react";

import { ReplyInput } from "./reply-input";
import { ExtendedDetailedReply, ExtendedReply } from "@/types";
import { UserAvatar } from "@/components/custom/user-avatar";

interface RepliesProps {
  replies: ExtendedDetailedReply[];
}

export const Replies: React.FC<RepliesProps> = ({ replies }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

const ReplyCard = ({ reply }: { reply: ExtendedDetailedReply }) => {
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
          <div
            className="border p-1 rounded-full cursor-pointer"
            onClick={() => toast.message("Coming Soon...")}
          >
            <Smile className="h-4 w-4 text-neutral-800" />
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
              <ReplyToReplyCard reply={reply} />
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
}

const ReplyToReplyCard: React.FC<ReplyToReplyCardProps> = ({ reply }) => {
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
            <div
              className="border w-fit p-1 rounded-full cursor-pointer"
              onClick={() => toast.message("Coming Soon...")}
            >
              <Smile className="h-4 w-4 text-neutral-800" />
            </div>
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
