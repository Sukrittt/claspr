import Link from "next/link";
import { format } from "date-fns";
import { Session } from "next-auth";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  NotebookPen,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExtendedAnnouncement } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAnnouncements } from "@/hooks/announcement";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AnnouncementSkeleton } from "@/components/skeletons/announcement-skeleton";
import { toast } from "sonner";

interface AnnouncementsProps {
  classroomId: string;
  session: Session;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  classroomId,
  session,
}) => {
  const mounted = useMounted();
  const { data: announcements, isLoading } = useGetAnnouncements(classroomId);

  if (!mounted) {
    return (
      <div className="pt-6">
        <AnnouncementSkeleton />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-6 space-y-4 h-full"
      >
        {isLoading ? (
          <AnnouncementSkeleton />
        ) : (!announcements || announcements.length === 0) && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-y-4">
            <NotebookPen className="h-16 w-16 text-neutral-800" />
            <p className="text-sm text-muted-foreground">
              No assigments created yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col gap-y-4">
                {announcements?.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    session={session}
                  />
                ))}
              </div>
            </ScrollArea>
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

interface AnnouncementCardProps {
  announcement: ExtendedAnnouncement;
  session: Session;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  session,
}) => {
  const submissionDetails = announcement.submissions.find(
    (submission) => submission.member.userId === session.user.id
  );

  const deadlinePassed = new Date() > announcement.dueDate;

  const getToolTipText = () => {
    if (submissionDetails) {
      return "Submitted";
    }

    if (deadlinePassed) {
      return "Missed";
    }

    return "Pending";
  };

  const toolTipText = getToolTipText();

  return (
    <motion.div
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link
        href={`/c/${announcement.classRoomId}/a/${announcement.id}`}
        onClick={() => toast.loading("Just a moment...", { duration: 1000 })}
        className="bg-neutral-200 hover:bg-neutral-300/70 transition text-sm rounded-lg py-4 px-3 flex items-center gap-x-3 cursor-pointer"
      >
        <UserAvatar user={announcement.creator} className="h-8 w-8" />
        <div className="space-y-1 w-full">
          <p className="font-semibold text-neutral-700">{announcement.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <span>{announcement.creator.name}</span>
              <span>•</span>
              <span>{timeAgo(announcement.createdAt)}</span>
            </div>
            <CustomTooltip text={toolTipText}>
              <div>
                <Badge
                  className={cn("text-[10px] py-px", {
                    "bg-green-600 hover:bg-green-600/80": submissionDetails,
                    "bg-destructive hover:bg-destructive/80": deadlinePassed,
                  })}
                >
                  {submissionDetails ? (
                    <>
                      <CalendarCheck className="h-3.5 w-3.5 mr-2" />
                      {format(submissionDetails.createdAt, "dd, MMM")}
                    </>
                  ) : (
                    <>
                      {deadlinePassed ? (
                        <CalendarX2 className="h-3.5 w-3.5 mr-2" />
                      ) : (
                        <CalendarClock className="h-3.5 w-3.5 mr-2" />
                      )}
                      {format(announcement.dueDate, "dd, MMM")}
                    </>
                  )}
                </Badge>
              </div>
            </CustomTooltip>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
