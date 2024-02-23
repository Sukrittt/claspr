import { Session } from "next-auth";
import { UsersRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ExtendedAssignment } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { useNotSubmittedStudents } from "@/hooks/assignment";
import { TeacherCommentsDialog } from "./teacher-comments-dialog";
import { NotSubmittedMembersSkeleton } from "@/components/skeletons/not-submitted-skeletons";

interface NotSubmittedMembersProps {
  assignment: ExtendedAssignment;
  session: Session;
}

export const NotSubmittedMembers: React.FC<NotSubmittedMembersProps> = ({
  assignment,
  session,
}) => {
  const { data: students, isLoading } = useNotSubmittedStudents(assignment.id);

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
        <AnimatePresence mode="wait">
          <motion.div
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ScrollArea className="h-[70vh]">
              <div className="flex flex-col gap-y-2">
                {students.map((student) => (
                  <div
                    key={student.userId}
                    className="flex items-center justify-between border-b text-sm px-3 py-2"
                  >
                    <div className="flex items-center gap-x-4">
                      <UserAvatar
                        user={student.user}
                        className="h-8 w-8 rounded-md"
                      />
                      <div>
                        <p className="font-medium">{student.user.name}</p>
                        <p className="text-muted-foreground text-[13px]">
                          {student.user.email}
                        </p>
                      </div>
                    </div>
                    <TeacherCommentsDialog
                      member={student}
                      assignment={assignment}
                      session={session}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
