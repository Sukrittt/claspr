import { MessageCircleMore } from "lucide-react";

import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ExtendedAssignment, ExtendedMembershipDetails } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeacherChat } from "@/components/assignment/comment/teacher-chat";

interface TeacherCommentsDialogProps {
  assignment: ExtendedAssignment;
  member: ExtendedMembershipDetails;
  session: Session;
}

export const TeacherCommentsDialog: React.FC<TeacherCommentsDialogProps> = ({
  member,
  assignment,
  session,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text={`Chat with ${member.user.name}`}>
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <MessageCircleMore className="text-muted-foreground h-5 w-5" />
            </Button>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle className="text-base">Comments</DialogTitle>
          <DialogDescription className="text-[13px]">
            Visible only to you and {member.user.name}
          </DialogDescription>
        </DialogHeader>

        <Separator />
        <TeacherChat
          assignment={assignment}
          session={session}
          receiverId={member.user.id}
        />
      </DialogContent>
    </Dialog>
  );
};
