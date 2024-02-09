import qs from "query-string";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCallback } from "react";
import { MoreVertical } from "lucide-react";
import { DiscussionType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useGetDiscussionDetails } from "@/hooks/discussion";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { Replies } from "@/components/discussions/reply/replies";
import { ReplyInput } from "@/components/discussions/reply/reply-input";
import { DiscussionDetailSkeleton } from "@/components/skeletons/discussion-detail-skeleton";

interface DiscussionDetailsProps {
  activeDiscussionId: string;
  discussionType: DiscussionType;
  classroomId: string;
}

export const DiscussionDetails: React.FC<DiscussionDetailsProps> = ({
  activeDiscussionId,
  discussionType,
  classroomId,
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
        url: `/c/${classroomId}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [params]);

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
            <div className="flex items-center justify-between">
              <h5 className="tracking-tight text-xl font-medium">
                {discussion.title}
              </h5>

              <MoreVertical
                className="h-4 w-4 cursor-pointer"
                onClick={() => toast.message("Coming Soon...")}
              />
            </div>

            <div className="border rounded-md space-y-4">
              <div className="p-4">
                <div className="flex items-center gap-x-2 text-[13px] pb-2">
                  <UserAvatar user={discussion.creator} className="h-6 w-6" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-neutral-800">
                      {discussion.creator.name}
                    </span>{" "}
                    on {format(discussion.createdAt, "MMM d, yyyy")}
                  </p>
                </div>

                <EditorOutput content={discussion.content} />
              </div>

              <ReplyInput discussionId={discussion.id} />
            </div>

            <div className="pb-20">
              <Replies replies={discussion.replies} />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
