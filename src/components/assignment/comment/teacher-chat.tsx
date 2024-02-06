"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { Inbox } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { CommentInput } from "./comment-input";
import { ContainerVariants } from "@/lib/motion";
import { useGetComments } from "@/hooks/comment";
import { CommentDropdown } from "./comment-dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getShortenedText, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/custom/user-avatar";
import { ExtendedAssignment, ExtendedComment } from "@/types";
import { CommentSkeleton } from "@/components/skeletons/comment-skeleton";

interface TeacherChatProps {
  assignment: ExtendedAssignment;
  session: Session;
  receiverId: string;
}

export const TeacherChat: React.FC<TeacherChatProps> = ({
  assignment,
  session,
  receiverId,
}) => {
  const { data: comments, isLoading } = useGetComments(
    assignment.id,
    true,
    receiverId
  );

  return (
    <>
      <div className="flex-1 text-sm text-muted-foreground">
        {isLoading ? (
          <CommentSkeleton isTeacherComment />
        ) : !comments || comments.length === 0 ? (
          <div className="h-[200px] flex justify-center items-center gap-x-2">
            <Inbox className="h-4 w-4" />
            <p>No comments yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ScrollArea className="h-[200px] pb-4">
                <div className="flex flex-col gap-y-4 pt-2">
                  {comments.map((comment) => (
                    <CommentCard
                      sessionId={session.user.id}
                      comment={comment}
                      key={comment.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <CommentInput
        assignment={assignment}
        session={session}
        receiverId={receiverId}
      />
    </>
  );
};

interface CommentCardProps {
  comment: ExtendedComment;
  sessionId: string;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, sessionId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex gap-x-2 w-full group">
      <UserAvatar user={comment.sender} className="h-5 w-5" />
      <div className="space-y-0.5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center tracking-tight text-xs gap-x-2">
            <p className="font-semibold text-neutral-800">
              {getShortenedText(comment.sender.name ?? "", 20)}
            </p>
            <p className="font-medium">{timeAgo(comment.createdAt)}</p>
          </div>

          {sessionId === comment.sender.id && (
            <div
              className={cn("opacity-0 group-hover:opacity-100 transition", {
                "opacity-100": isDropdownOpen,
              })}
            >
              <CommentDropdown
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                comment={comment}
              />
            </div>
          )}
        </div>

        <p className="text-[13px] break-format text-neutral-700">
          {comment.message}
          {comment.isEdited && (
            <span className="pl-1 font-semibold text-[11px] text-muted-foreground">
              (Edited)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
