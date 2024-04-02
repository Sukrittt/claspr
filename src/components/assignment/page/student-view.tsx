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
    <div className="px-4 lg:px-20 py-8 grid grid-cols-8 gap-8">
      <div className="col-span-8 lg:col-span-5 xl:col-span-6 space-y-4 border p-4 rounded-md">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {assignment.title}
            </h2>
            <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <UserAvatar user={assignment.creator} className="h-4 w-4" />
              <span>{assignment.creator.name}</span>

              <span>•</span>
              <span>Updated {timeAgo(assignment.updatedAt)}</span>

              <span>•</span>
              <SubmissionDetails assignment={assignment}>
                <span>
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
      <div className="col-span-8 lg:col-span-3 xl:col-span-2 w-full flex flex-col gap-y-4">
        <SubmissionCard assignment={assignment} />
        <Comments assignment={assignment} session={session} />
      </div>
    </div>
  );
};
