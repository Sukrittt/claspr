import { UserX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { getShortenedText } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { useGetHelpfulUsers } from "@/hooks/discussion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { HelpfulUsersSkeleton } from "@/components/skeletons/helpful-users-skeleton";

export const HelpfulUsers = ({ classroomId }: { classroomId: string }) => {
  const { data: helpfulUsers, isLoading } = useGetHelpfulUsers(classroomId);

  return (
    <div className="border rounded-md px-3 py-4 pr-0">
      <div className="flex gap-x-2 text-sm">
        <p className="font-medium">Most Helpful</p>
        <p className="text-muted-foreground text-[11px] mt-px">Last 30 days</p>
      </div>

      <Separator className="my-1" />

      <ScrollArea className="h-[30vh] flex flex-col gap-y-2 pr-0">
        {isLoading ? (
          <HelpfulUsersSkeleton />
        ) : !helpfulUsers || helpfulUsers.length === 0 ? (
          <div className="flex flex-col gap-y-2 items-center justify-center pt-[10vh]">
            <UserX className="h-6 w-6 text-neutral-800" />
            <p className="text-muted-foreground text-[13px]">No replies yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-y-2"
            >
              {helpfulUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b border-neutral-200 py-2 mr-3"
                >
                  <div className="flex items-center gap-x-2">
                    <UserAvatar user={user} className="h-4 w-4" />
                    <p className="text-xs">
                      {getShortenedText(user.name ?? "Anonymus User", 20)}
                    </p>
                  </div>

                  <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                    <CustomTooltip text={`${user._count.replies} replies`}>
                      <span>{user._count.replies}</span>
                    </CustomTooltip>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  );
};
