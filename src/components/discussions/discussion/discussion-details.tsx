import { useAtom } from "jotai";
import { format } from "date-fns";
import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { ReactionLists } from "./reaction-lists";
import { ContainerVariants } from "@/lib/motion";
import { activeDiscussionIdAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryChange } from "@/hooks/use-query-change";
import { DiscussionDropdown } from "./discussion-dropdown";
import { useGetDiscussionDetails } from "@/hooks/discussion";
import { UserAvatar } from "@/components/custom/user-avatar";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { Replies } from "@/components/discussions/reply/replies";
import { RenameDiscussionTitle } from "./rename-discussion-title";
import { ReplyInput } from "@/components/discussions/reply/reply-input";
import { AnswerDetails } from "@/components/discussions/questionnaire/answer-details";
import { DiscussionDetailSkeleton } from "@/components/skeletons/discussion-detail-skeleton";

interface DiscussionDetailsProps {
  activeDiscussionId: string;
  discussionType: DiscussionType;
  session: Session;
  classroomId: string;
}

export const DiscussionDetails: React.FC<DiscussionDetailsProps> = ({
  activeDiscussionId,
  discussionType,
  session,
  classroomId,
}) => {
  const { data: discussion, isLoading } = useGetDiscussionDetails({
    discussionId: activeDiscussionId,
    discussionType,
  });
  const [, setActiveDiscussionId] = useAtom(activeDiscussionIdAtom);

  const handleQueryChange = useQueryChange();

  const selectedReply = discussion?.replies.find(
    (reply) =>
      reply.selected || (reply.replies && reply.replies.find((r) => r.selected))
  );

  return (
    <ScrollArea className="h-[73vh]">
      {isLoading ? (
        <DiscussionDetailSkeleton />
      ) : !discussion ? (
        <div className="pt-48 flex flex-col items-center gap-y-2 text-sm text-muted-foreground">
          <div className="space-y-1 text-center">
            <p>
              We couldn&rsquo;t find the discussion you&rsquo;re looking for.
            </p>
            <p
              className="font-semibold cursor-pointer hover:underline underline-offset-4"
              onClick={() => {
                setActiveDiscussionId(null);
                handleQueryChange(`/c/${classroomId}`, { discussion: null });
              }}
            >
              Go back
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4 pr-2"
          >
            <RenameDiscussionTitle
              discussionId={discussion.id}
              discussionType={discussion.discussionType}
              initialTitle={discussion.title}
              isEditable={session.user.id === discussion.creatorId}
            />

            <div className="border rounded-md space-y-4 overflow-hidden">
              <div className="p-4 pb-0 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 text-[13px] pb-2">
                      <UserAvatar
                        user={discussion.creator}
                        className="h-6 w-6"
                      />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-neutral-800 dark:text-foreground">
                          {discussion.creator.name}
                        </span>{" "}
                        on {format(discussion.createdAt, "MMM d, yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center gap-x-2">
                      {discussion.isEdited && (
                        <span className="text-muted-foreground text-xs tracking-tight">
                          edited
                        </span>
                      )}

                      {discussion.creator.id === session.user.id && (
                        <DiscussionDropdown
                          discussionId={discussion.id}
                          classroomId={discussion.classroomId}
                          discussionContent={discussion.content}
                          discussionType={discussion.discussionType}
                        />
                      )}
                    </div>
                  </div>

                  <EditorOutput content={discussion.content} />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground tracking-tight">
                  <ReactionLists
                    discussionId={discussion.id}
                    reactions={discussion.reactions}
                    session={session}
                  />
                  <span>
                    {discussion.replies.length}{" "}
                    {discussion.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </div>

              {selectedReply &&
              selectedReply.replies &&
              discussionType === "questionnaires" ? (
                (() => {
                  const selectedReplyToReply = selectedReply.replies.find(
                    (r) => r.selected === true
                  );
                  return selectedReplyToReply ? (
                    <AnswerDetails
                      text={selectedReplyToReply.text}
                      answeredBy={selectedReplyToReply.creator}
                      answeredAt={selectedReplyToReply.createdAt}
                    />
                  ) : (
                    <AnswerDetails
                      text={selectedReply.text}
                      answeredBy={selectedReply.creator}
                      answeredAt={selectedReply.createdAt}
                    />
                  );
                })()
              ) : (
                <ReplyInput discussionId={discussion.id} />
              )}
            </div>

            {discussion.replies.length > 0 && (
              <div className="text-muted-foreground flex justify-center gap-x-4 w-full">
                <span>*</span>
                <span>*</span>
                <span>*</span>
              </div>
            )}

            <div className="pb-20">
              <Replies
                replies={discussion.replies}
                session={session}
                discussionOwnerId={discussion.creatorId}
                discussionId={discussion.id}
                discussionType={discussion.discussionType}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
