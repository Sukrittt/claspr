import { Session } from "next-auth";
import { DiscussionType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LightbulbOff,
  MegaphoneOff,
  MessageSquareOff,
  MessageSquareX,
} from "lucide-react";

import { ContainerVariants } from "@/lib/motion";
import { useGetDiscussions } from "@/hooks/discussion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tabs } from "@/components/discussions/discussion-tabs";
import { DiscussionSkeleton } from "@/components/skeletons/discussion-skeleton";
import { DiscussionCard } from "@/components/discussions/discussion/discussion-card";

interface ClassDiscussionsProps {
  classroomId: string;
  session: Session;
  discussionType: DiscussionType;
}

export const Discussions: React.FC<ClassDiscussionsProps> = ({
  classroomId,
  discussionType,
  session,
}) => {
  const params = useSearchParams();

  const activeTab =
    tabs.find((tab) => tab.value === params?.get("tab")) ?? tabs[0];

  const { data: discussions, isLoading } = useGetDiscussions({
    classroomId,
    discussionType,
  });

  const EmptyData = {
    announcements: {
      label: "No announcements created yet.",
      icon: <MegaphoneOff className="h-10 w-10 text-neutral-800" />,
    },
    general: {
      label: "No general discussions created yet.",
      icon: <MessageSquareOff className="h-10 w-10 text-neutral-800" />,
    },
    questionnaires: {
      label: "No questionnaires created yet.",
      icon: <MessageSquareX className="h-10 w-10 text-neutral-800" />,
    },
    ideas: {
      label: "No ideas created yet.",
      icon: <LightbulbOff className="h-10 w-10 text-neutral-800" />,
    },
  };

  return (
    <ScrollArea className="h-[68vh]">
      {isLoading ? (
        <DiscussionSkeleton />
      ) : !discussions || discussions.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-y-2">
          {EmptyData[activeTab.value as keyof typeof EmptyData].icon}
          <p className="text-sm text-muted-foreground">
            {EmptyData[activeTab.value as keyof typeof EmptyData].label}
          </p>
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
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                session={session}
                discussion={discussion}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </ScrollArea>
  );
};
