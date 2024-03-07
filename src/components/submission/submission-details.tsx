"use client";
import { format, isAfter } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { ExtendedAssignment } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubmission } from "@/hooks/submission";
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

  if (isLoading) return <Skeleton className="h-4 w-16" />;

  // If the submission is handed in after the due date, it is considered late
  const lateSubmission = isAfter(submission?.createdAt!, assignment.dueDate);

  const deadlinePassed = isAfter(currentDate, assignment.dueDate);

  if (submission) {
    if (lateSubmission) {
      return (
        <CustomTooltip
          text={`Submitted late on ${format(
            submission.createdAt,
            "dd MMM, yy"
          )}`}
        >
          <div className="text-yellow-600 hover:text-yellow-600/80">
            Late Submission
          </div>
        </CustomTooltip>
      );
    } else {
      return (
        <CustomTooltip
          text={`Submitted on ${format(submission.createdAt, "dd MMM, yy")}`}
        >
          <div>
            <div className="text-green-600 hover:text-green-600/80">
              Submitted
            </div>
          </div>
        </CustomTooltip>
      );
    }
  } else {
    return deadlinePassed ? (
      <CustomTooltip text="You have not yet submitted this assignment">
        <div>
          <div className="tracking-tight text-[13px] text-destructive hover:text-destructive/80">
            Deadline Passed
          </div>
        </div>
      </CustomTooltip>
    ) : (
      <>{children}</>
    );
  }
};
