import qs from "query-string";
import { format } from "date-fns";
import { Session } from "next-auth";
import { useCallback } from "react";
import { DiscussionType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { ReactionLists } from "./reaction-lists";
import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiscussionDropdown } from "./discussion-dropdown";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useGetDiscussionDetails } from "@/hooks/discussion";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { Replies } from "@/components/discussions/reply/replies";
import { RenameDiscussionTitle } from "./rename-discussion-title";
import { ReplyInput } from "@/components/discussions/reply/reply-input";
import { DiscussionDetailSkeleton } from "@/components/skeletons/discussion-detail-skeleton";
import { AnswerDetails } from "@/components/discussions/questionnaire/answer-details";

interface DiscussionDetailsProps {
  activeDiscussionId: string;
  discussionType: DiscussionType;
  session: Session;
}

export const DiscussionDetails: React.FC<DiscussionDetailsProps> = ({
  activeDiscussionId,
  discussionType,
  session,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const { data: discussion, isLoading } = useGetDiscussionDetails({
    discussionId: activeDiscussionId,
    discussionType,
  });

  const handleRemoveActiveTab = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      active: undefined,
    };

    const url = qs.stringifyUrl(
      {
        url: `/c/${discussion?.classroomId}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [params]);

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
              onClick={handleRemoveActiveTab}
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

            <div className="border rounded-md space-y-4">
              <div className="p-4 pb-0 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 text-[13px] pb-2">
                      <UserAvatar
                        user={discussion.creator}
                        className="h-6 w-6"
                      />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-neutral-800">
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

              {selectedReply && selectedReply.replies ? (
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
