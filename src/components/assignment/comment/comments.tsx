"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { Inbox } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useGetComments } from "@/hooks/comment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtendedAssignment, ExtendedComment } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommentInput } from "./comment-input";
import { ContainerVariants } from "@/lib/motion";
import { CommentDropdown } from "./comment-dropdown";
import { cn, getShortenedText, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CommentSkeleton } from "@/components/skeletons/comment-skeleton";

interface CommentsProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const Comments: React.FC<CommentsProps> = ({ assignment, session }) => {
  const { data: comments, isLoading } = useGetComments(assignment.id);

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="border-b py-2 pl-4 pr-3 space-y-0.5">
        <CardTitle className="text-[13px] text-neutral-700 dark:text-foreground">
          Comments
        </CardTitle>
        <CardDescription className="text-[13px]">
          Visible only to you and your teacher
        </CardDescription>
      </CardHeader>
      <CardContent className="py-3 flex-1 flex flex-col gap-y-2 pl-4 pr-3">
        <div className="flex-1 text-sm text-muted-foreground">
          {isLoading ? (
            <CommentSkeleton />
          ) : !comments || comments.length === 0 ? (
            <div className="pt-16 flex justify-center items-center gap-x-2">
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
                <ScrollArea className="h-[27vh] pb-4">
                  <div className="flex flex-col gap-y-4 pt-2">
                    {comments.map((comment) => (
                      <CommentCard
                        comment={comment}
                        key={comment.id}
                        sessionId={session.user.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <CommentInput assignment={assignment} session={session} />
      </CardContent>
    </Card>
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
      <div className="mt-1">
        <UserAvatar user={comment.sender} className="h-5 w-5" />
      </div>

      <div className="space-y-0.5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center tracking-tight text-xs gap-x-2">
            <p className="font-semibold text-neutral-800 dark:text-foreground">
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

        <p className="text-[13px] break-format text-neutral-700 dark:text-neutral-200">
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
