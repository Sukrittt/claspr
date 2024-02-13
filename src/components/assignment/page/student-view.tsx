import { format } from "date-fns";
import { Session } from "next-auth";

import { timeAgo } from "@/lib/utils";
import { ExtendedAssignmentDetails } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { Comments } from "@/components/assignment/comment/comments";
import { SubmissionCard } from "@/components/submission/submission-card";
import { SubmissionDetails } from "@/components/submission/submission-details";

interface StudentViewProps {
  assignment: ExtendedAssignmentDetails;
  session: Session;
}

export const StudentView: React.FC<StudentViewProps> = ({
  assignment,
  session,
}) => {
  return (
    <div className="px-20 py-8 grid grid-cols-8 gap-8">
      <div className="col-span-5 xl:col-span-6 space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {assignment.title}
            </h2>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-x-1">
                <UserAvatar user={assignment.creator} className="h-5 w-5" />
                <span>{assignment.creator.name}</span>
                <span>•</span>
                <span>Updated {timeAgo(assignment.updatedAt)}</span>
              </div>

              <SubmissionDetails assignment={assignment}>
                <span className="text-[12px]">
                  Submit before{" "}
                  <span className="font-semibold">
                    {format(assignment.dueDate, "do MMM, h:mm a")}
                  </span>
                </span>
              </SubmissionDetails>
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-[480px] pb-10">
            <EditorOutput content={assignment.description} />
          </ScrollArea>
        </div>
      </div>
      <div className="col-span-3 xl:col-span-2 w-full flex flex-col gap-y-4">
        <SubmissionCard assignment={assignment} />
        <Comments assignment={assignment} session={session} />
      </div>
    </div>
  );
};
