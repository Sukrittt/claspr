import { format } from "date-fns";
import {
  File,
  FileCheck2,
  FileClock,
  FilePen,
  Link as LinkIcon,
  UsersRound,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SubmissionReview } from "./submission-review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSubmissionStatusFromQuery } from "@/lib/utils";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useAssignmentSubmissions } from "@/hooks/submission";
import { NotSubmittedMembers } from "./not-submitted-members";
import { ExtendedAssignment, ExtendedSubmission, FilterType } from "@/types";
import { SubmissionDetailsSkeleton } from "@/components/skeletons/submission-details-skeleton";

interface SubmissionsProps {
  assignment: ExtendedAssignment;
}

export const Submissions: React.FC<SubmissionsProps> = ({ assignment }) => {
  const params = useSearchParams();

  // Search params
  const status = getSubmissionStatusFromQuery(params.get("status"));

  const {
    data: submissions,
    isLoading,
    isFetching,
  } = useAssignmentSubmissions(assignment.id, status as FilterType);

  const EmptyData = {
    pending: {
      label: "No submissions left for evaluation.",
      icon: <FileClock className="h-10 w-10 text-neutral-800" />,
    },
    evaluated: {
      label: "All submissions have been evaluated.",
      icon: <FileCheck2 className="h-10 w-10 text-neutral-800" />,
    },
    "changes-requested": {
      label: "No submissions left for re-evaluation.",
      icon: <FilePen className="h-10 w-10 text-neutral-800" />,
    },
  };

  return (
    <div className="h-full">
      {params.get("status") === "not-submitted" ? (
        <NotSubmittedMembers assignmentId={assignment.id} />
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
        <ScrollArea className="h-[70vh]">
          <div className="flex flex-col gap-y-2 h-full">
            {submissions.map((submission) => (
              <StudentSubmission
                key={submission.id}
                submission={submission}
                assignment={assignment}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface StudentSubmissionProps {
  submission: ExtendedSubmission;
  assignment: ExtendedAssignment;
}

const StudentSubmission: React.FC<StudentSubmissionProps> = ({
  submission,
  assignment,
}) => {
  const lateSubmission =
    !assignment.lateSubmission && submission.createdAt > assignment.dueDate;

  return (
    <SubmissionReview submission={submission} assignment={assignment}>
      <div className="flex items-center gap-x-4 border-b text-sm px-3 py-2 cursor-pointer hover:bg-neutral-100 transition">
        <UserAvatar
          user={submission.member.user}
          className="h-8 w-8 rounded-md"
        />
        <div>
          <p className="font-medium">{submission.member.user.name}</p>
          <div className="text-[12px] text-muted-foreground flex items-center gap-x-2.5">
            {submission.media.length === 0 ? (
              <p>No work attached</p>
            ) : (
              <>
                <span className="text-muted-foreground text-[12px]">
                  Submitted {lateSubmission && <span>late</span>} on{" "}
                  {format(submission.createdAt, "d MMM")}
                </span>
                <Separator orientation="vertical" className="h-5" />
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
    </SubmissionReview>
  );
};
