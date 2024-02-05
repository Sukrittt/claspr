import { Session } from "next-auth";
import { SubmissionStatus } from "@prisma/client";
import {
  CheckCircle2,
  FilePenLine,
  Hourglass,
  Link as LinkIcon,
} from "lucide-react";

import { trpc } from "@/trpc/client";
import { SubmissionReview } from "./submission-review";
import { UserAvatar } from "@/components/custom/user-avatar";
import { ExtendedAssignment, ExtendedSubmission } from "@/types";

interface SubmissionsProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const Submissions: React.FC<SubmissionsProps> = ({
  assignment,
  session,
}) => {
  const { data: submissions, isLoading } =
    trpc.submission.getAssignmentSubmissions.useQuery({
      assignmentId: assignment.id,
    });

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : !submissions || submissions.length === 0 ? (
        <p>No submissions</p>
      ) : (
        submissions.map((submission) => (
          <StudentSubmission
            key={submission.id}
            submission={submission}
            assignment={assignment}
            session={session}
          />
        ))
      )}
    </>
  );
};

interface StudentSubmissionProps {
  submission: ExtendedSubmission;
  assignment: ExtendedAssignment;
  session: Session;
}

const StudentSubmission: React.FC<StudentSubmissionProps> = ({
  submission,
  assignment,
  session,
}) => {
  const Icon = {
    [SubmissionStatus.PENDING]: (
      <Hourglass className="h-4 w-4 text-muted-foreground" />
    ),
    [SubmissionStatus.APPROVED]: (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ),
    [SubmissionStatus.CHANGES_REQUESTED]: (
      <FilePenLine className="h-4 w-4 text-red-500" />
    ),
  };

  return (
    <SubmissionReview
      submission={submission}
      assignment={assignment}
      session={session}
    >
      <div className="flex items-center justify-between border-b text-sm px-3 py-2 cursor-pointer hover:bg-neutral-100 transition">
        <div className="flex items-center gap-x-4">
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
                submission.media.map((media) => (
                  <div key={media.id} className="flex items-center gap-x-1">
                    {media.mediaType === "LINK" && (
                      <LinkIcon className="h-2.5 w-2.5 text-muted-foreground" />
                    )}
                    <span>{media.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* REMOVE THIS WHEN SHOWING WHO DIDN'T SUBMIT */}
        <div>{Icon[submission.submissionStatus!]}</div>
      </div>
    </SubmissionReview>
  );
};
