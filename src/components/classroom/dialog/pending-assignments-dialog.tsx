import Link from "next/link";
import { isBefore } from "date-fns";
import { PartyPopper } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, timeAgo } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

type PendingAssignment = {
  id: string;
  title: string;
  dueDate: Date;
  createdAt: Date;
};

interface PendingAssignmentsDialogProps {
  classroomId: string;
  pendingAssignments: PendingAssignment[] | undefined;
}

export const PendingAssignmentsDialog: React.FC<
  PendingAssignmentsDialogProps
> = ({ pendingAssignments, classroomId }) => {
  const hasMissed = (dueDate: Date) => {
    const currentDate = new Date();
    const isMissed = isBefore(dueDate, currentDate);

    return isMissed;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="View pending assignments">
            <p className="text-muted-foreground hover:underline cursor-pointer underline-offset-4">
              Pending
            </p>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Pending Assignments</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[30vh]">
          <div className="flex flex-col gap-y-2">
            {!pendingAssignments || pendingAssignments.length === 0 ? (
              <div className="h-[30vh] flex flex-col text-muted-foreground text-[13px] justify-center items-center gap-y-2">
                <PartyPopper className="h-5 w-5" />
                <p>No pending assignments!</p>
              </div>
            ) : (
              pendingAssignments.map((assignment) => (
                <Link
                  href={`/c/${classroomId}/a/${assignment.id}`}
                  key={assignment.id}
                  className="group space-y-1 border-b pb-2"
                >
                  <p className="group-hover:underline group-hover:text-neutral-800 transition text-sm tracking-tight underline-offset-4">
                    {assignment.title}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-x-1 text-xs">
                    <span>Posted this {timeAgo(assignment.createdAt)}</span>
                    <span>•</span>

                    <span
                      className={cn({
                        "text-destructive": hasMissed(assignment.dueDate),
                      })}
                    >
                      {hasMissed(assignment.dueDate) ? "Missed" : "Due"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
