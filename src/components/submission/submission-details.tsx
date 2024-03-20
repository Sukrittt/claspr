"use client";
import { format, isAfter } from "date-fns";

import { ExtendedAssignment } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubmission } from "@/hooks/submission";
import { calculateDateDifference } from "@/lib/utils";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface SubmissionDetailsProps {
  children: React.ReactNode;
  assignment: ExtendedAssignment;
}

export const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  children,
  assignment,
}) => {
  const { data: submission, isLoading } = useGetSubmission(assignment.id);

  const currentDate = new Date();

  if (isLoading) return <Skeleton className="h-3.5 w-32" />;

  // If the submission is handed in after the due date, it is considered late
  const lateSubmission = isAfter(submission?.createdAt!, assignment.dueDate);

  const deadlinePassed = isAfter(currentDate, assignment.dueDate);

  if (submission) {
    if (lateSubmission) {
      const submittedLateBy = calculateDateDifference(
        submission.createdAt,
        assignment.dueDate
      );

      return (
        <CustomTooltip
          text={`Submitted late on ${format(
            submission.createdAt,
            "do MMM, h:mm a"
          )}`}
        >
          <div className="text-yellow-600 hover:text-yellow-600/80 font-medium">
            Late Submission{" "}
            <span className="text-muted-foreground">by {submittedLateBy}</span>
          </div>
        </CustomTooltip>
      );
    } else {
      return (
        <CustomTooltip
          text={`Submitted on ${format(
            submission.createdAt,
            "do MMM, h:mm a"
          )}`}
        >
          <div>
            <div className="text-green-600 hover:text-green-600/80 font-medium">
              Submitted
            </div>
          </div>
        </CustomTooltip>
      );
    }
  } else {
    return deadlinePassed ? (
      <CustomTooltip text="No submission found">
        <div>
          <div className="tracking-tight text-[13px] text-destructive dark:text-[#eb5757] hover:text-[#eb5757]/80 font-medium">
            Deadline Passed
          </div>
        </div>
      </CustomTooltip>
    ) : (
      <>{children}</>
    );
  }
};
