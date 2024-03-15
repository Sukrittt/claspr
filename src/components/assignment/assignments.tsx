import Link from "next/link";
import { Session } from "next-auth";
import { format, isAfter } from "date-fns";
import { ClipboardList } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn, timeAgo } from "@/lib/utils";
import { ExtendedAssignment } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { useGetPartOfClass } from "@/hooks/class";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignments } from "@/hooks/assignment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
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

  const noOfSubmissions = assignment.submissions.length;

  return (
    <motion.div
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="border-b text-sm px-3 py-2 flex items-center gap-x-2">
        <UserAvatar user={assignment.creator} className="h-8 w-8 rounded-md" />
        <div className="flex flex-col gap-y-1 w-full">
          <Link
            href={`/c/${assignment.classRoomId}/a/${assignment.id}`}
            className="font-medium text-neutral-700 hover:underline underline-offset-4 w-fit"
          >
            {assignment.title}
          </Link>
          <div className="flex items-center gap-x-1 text-[11px] text-muted-foreground">
            <span>
              {session.user.id === assignment.creator.id
                ? "You"
                : assignment.creator.name}{" "}
              posted this {timeAgo(assignment.createdAt)}
            </span>
            <span>•</span>
            {isLoading ? (
              <Skeleton className="h-3 w-20" />
            ) : isTeacher ? (
              <span>
                {noOfSubmissions} submission{noOfSubmissions !== 1 && "s"}
              </span>
            ) : (
              <>
                <p
                  className={cn("font-semibold", {
                    "text-green-600": !!submissionDetails,
                    "text-destructive": !!!submissionDetails && deadlinePassed,
                  })}
                >
                  {submissionDetails
                    ? "Submitted"
                    : deadlinePassed
                    ? "Missed"
                    : "Pending"}
                </p>
                {!submissionDetails && !deadlinePassed && (
                  <>
                    <span>•</span>
                    Submit before{" "}
                    <span className="font-semibold">
                      {format(assignment.dueDate, "do MMM, h:mm a")}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
