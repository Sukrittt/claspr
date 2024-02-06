import { UsersRound } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useNotSubmittedStudents } from "@/hooks/assignment";
import { NotSubmittedMembersSkeleton } from "@/components/skeletons/not-submitted-skeletons";

interface NotSubmittedMembersProps {
  assignmentId: string;
}

export const NotSubmittedMembers: React.FC<NotSubmittedMembersProps> = ({
  assignmentId,
}) => {
  const { data: students, isLoading } = useNotSubmittedStudents(assignmentId);

  return (
    <div className="h-full">
      {isLoading ? (
        <NotSubmittedMembersSkeleton />
      ) : !students || students.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-y-2">
          <UsersRound className="h-10 w-10 text-neutral-800" />
          <p className="text-sm text-muted-foreground">
            All students have submitted their work.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[70vh]">
          <div className="flex flex-col gap-y-2">
            {students.map((student) => (
              <div
                key={student.userId}
                className="flex items-center gap-x-4 border-b text-sm px-3 py-2"
              >
                <UserAvatar
                  user={student.user}
                  className="h-8 w-8 rounded-md"
                />
                <p>{student.user.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};