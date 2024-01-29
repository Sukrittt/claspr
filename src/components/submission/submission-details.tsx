"use client";
import { format, isAfter } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { ExtendedAnnouncement } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubmission } from "@/hooks/submission";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface SubmissionDetailsProps {
  children: React.ReactNode;
  announcement: ExtendedAnnouncement;
}

export const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  children,
  announcement,
}) => {
  const { data: submission, isLoading } = useGetSubmission(announcement.id);

  const currentDate = new Date();

  if (isLoading) return <Skeleton className="h-4 w-16" />;

  // If the submission is handed in after the due date, it is considered late
  const lateSubmission = isAfter(submission?.createdAt!, announcement.dueDate);

  const deadlinePassed = isAfter(currentDate, announcement.dueDate);

  if (submission) {
    if (lateSubmission) {
      return (
        <CustomTooltip
          text={`Submitted on ${format(submission.createdAt, "dd MMM, yy")}`}
        >
          <div>
            <Badge className="bg-yellow-600 hover:bg-yellow-600/80">
              Late Submission
            </Badge>
          </div>
        </CustomTooltip>
      );
    } else {
      return (
        <CustomTooltip
          text={`Submitted on ${format(submission.createdAt, "dd MMM, yy")}`}
        >
          <div>
            <Badge className="bg-green-600 hover:bg-green-600/80">
              Submitted
            </Badge>
          </div>
        </CustomTooltip>
      );
    }
  } else {
    return deadlinePassed ? (
      <CustomTooltip text="You have not submitted this assignment">
        <div>
          <Badge className="bg-destructive hover:bg-destructive/80">
            Deadline Passed
          </Badge>
        </div>
      </CustomTooltip>
    ) : (
      <>{children}</>
    );
  }
};
