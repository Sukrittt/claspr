import { useAtom } from "jotai";
import { Session } from "next-auth";
import { format, isAfter } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, FileClock, FilePen, Link as LinkIcon } from "lucide-react";

import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { SubmissionReview } from "./submission-review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useAssignmentSubmissions } from "@/hooks/submission";
import { NotSubmittedMembers } from "./not-submitted-members";
import { TeacherCommentsDialog } from "./teacher-comments-dialog";
import { SubmissionDetailsSkeleton } from "@/components/skeletons/submission-details-skeleton";
import {
  ExtendedAssignmentDetails,
  ExtendedSubmission,
  FilterType,
} from "@/types";
import { assignmentStatusAtom } from "@/atoms";

interface SubmissionsProps {
  assignment: ExtendedAssignmentDetails;
  session: Session;
}

export const Submissions: React.FC<SubmissionsProps> = ({
  assignment,
  session,
}) => {
  const [status] = useAtom(assignmentStatusAtom);

  const {
    data: submissions,
    isLoading,
    isFetching,
  } = useAssignmentSubmissions(assignment.id, status as FilterType);

  const EmptyData = {
    pending: {
      label: "No submissions left for evaluation.",
      icon: (
        <FileClock className="h-10 w-10 text-neutral-800 dark:text-muted-foreground" />
      ),
    },
    evaluated: {
      label: "All submissions have been evaluated.",
      icon: (
        <FileCheck2 className="h-10 w-10 text-neutral-800 dark:text-muted-foreground" />
      ),
    },
    "changes-requested": {
      label: "No submissions left for re-evaluation.",
      icon: (
        <FilePen className="h-10 w-10 text-neutral-800 dark:text-muted-foreground" />
      ),
    },
  };

  return (
    <div className="h-full">
      {status === "not-submitted" ? (
        <NotSubmittedMembers assignment={assignment} session={session} />
      ) : isLoading || isFetching ? (
        <SubmissionDetailsSkeleton />
      ) : !submissions || submissions.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-y-2">
          {EmptyData[status as keyof typeof EmptyData].icon}
          <p className="text-sm text-muted-foreground">
            {EmptyData[status as keyof typeof EmptyData].label}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ScrollArea className="h-[70vh]">
              <div className="flex flex-col gap-y-2 h-full">
                {submissions.map((submission) => (
                  <StudentSubmission
                    key={submission.id}
                    submission={submission}
                    assignment={assignment}
                    session={session}
                  />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

interface StudentSubmissionProps {
  submission: ExtendedSubmission;
  assignment: ExtendedAssignmentDetails;
  session: Session;
}

const StudentSubmission: React.FC<StudentSubmissionProps> = ({
  submission,
  assignment,
  session,
}) => {
  const lateSubmission =
    assignment.lateSubmission &&
    isAfter(submission.createdAt, assignment.dueDate);

  return (
    <SubmissionReview submission={submission} assignment={assignment}>
      <div className="flex items-center justify-between border-b text-sm px-3 py-2 cursor-pointer group">
        <div className="flex items-center gap-x-4">
          <UserAvatar
            user={submission.member.user}
            className="h-8 w-8 rounded-md"
          />
          <div>
            <p className="font-medium group-hover:underline underline-offset-4">
              {submission.member.user.name}
            </p>
            <div className="text-[12px] text-muted-foreground flex items-center gap-x-2.5">
              {submission.media.length === 0 ? (
                <p>No work attached</p>
              ) : (
                <>
                  <span className="text-muted-foreground text-[12px]">
                    Submitted {lateSubmission && <span>late</span>} on{" "}
                    {format(submission.createdAt, "d MMM")}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  {submission.media.map((media) => (
                    <div key={media.id} className="flex items-center gap-x-1">
                      {media.mediaType === "LINK" && (
                        <LinkIcon className="h-2.5 w-2.5 text-muted-foreground" />
                      )}
                      <span>{media.label}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <TeacherCommentsDialog
            member={submission.member}
            assignment={assignment}
            session={session}
          />
        </div>
      </div>
    </SubmissionReview>
  );
};
