import Link from "next/link";
import { Session } from "next-auth";
import { format, isAfter } from "date-fns";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  Check,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

import { cn, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExtendedAssignment } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { useGetPartOfClass } from "@/hooks/class";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignments } from "@/hooks/assignment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { AssignmentSkeleton } from "@/components/skeletons/assignment-skeleton";

interface AssignmentProps {
  classroomId: string;
  session: Session;
}

export const Assignments: React.FC<AssignmentProps> = ({
  classroomId,
  session,
}) => {
  const mounted = useMounted();

  // const params = useSearchParams()

  // // Search params
  // const filter = params?.get("filter") ?? "date-created"

  const { data: assignments, isLoading } = useGetAssignments(classroomId);

  if (!mounted) {
    return <AssignmentSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 h-full"
      >
        {isLoading ? (
          <AssignmentSkeleton />
        ) : !assignments || assignments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-y-2">
            <ClipboardList className="h-10 w-10 text-neutral-800" />
            <p className="text-sm text-muted-foreground">
              No assigments created yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <ScrollArea className="h-[500px]">
              <div className="flex flex-col gap-y-4">
                {assignments?.map((assignment) => (
                  <AssignmentCardList
                    key={assignment.id}
                    assignment={assignment}
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

interface AssignmentCardListProps {
  assignment: ExtendedAssignment;
  session: Session;
}

const AssignmentCardList: React.FC<AssignmentCardListProps> = ({
  assignment,
  session,
}) => {
  const { data: isTeacher, isLoading } = useGetPartOfClass({
    classroomId: assignment.classRoomId,
    isTeacher: true,
  });

  const submissionDetails = assignment.submissions.find(
    (submission) => submission.member.userId === session.user.id
  );

  const currentDate = new Date();
  const deadlinePassed = isAfter(currentDate, assignment.dueDate);

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
  const noOfSubmissions = assignment.submissions.length;

  return (
    <motion.div
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link
        href={`/c/${assignment.classRoomId}/a/${assignment.id}`}
        onClick={() => toast.loading("Just a moment...", { duration: 1000 })}
        className="border-b text-sm px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition"
      >
        <div className="flex items-center gap-x-2">
          <UserAvatar
            user={assignment.creator}
            className="h-8 w-8 rounded-md"
          />
          <div className="space-y-1 w-full">
            <p className="font-medium text-neutral-700">{assignment.title}</p>
            <span className="text-[11px] text-muted-foreground">
              {assignment.creator.name} posted this{" "}
              {timeAgo(assignment.createdAt)}
            </span>
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-5 w-[4.5rem] rounded-full" />
        ) : isTeacher ? (
          <div className="flex items-center gap-x-1 font-medium">
            <div className="border rounded-full p-1 text-neutral-800">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs">{noOfSubmissions}</span>
          </div>
        ) : (
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
                    {format(assignment.dueDate, "dd, MMM")}
                  </>
                )}
              </Badge>
            </div>
          </CustomTooltip>
        )}
      </Link>
    </motion.div>
  );
};
