import { motion, AnimatePresence } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { KickMemberDialog } from "./dialog/class-kick-member";
import { ExtendedMembershipDetails, MinifiedUser } from "@/types";

interface ClassMembersProps {
  members: ExtendedMembershipDetails[];
  creator: MinifiedUser;
  sessionId: string;
}

export const ClassMembers: React.FC<ClassMembersProps> = ({
  members,
  creator,
  sessionId,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 h-full"
      >
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Classroom members
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your classroom members here.
          </p>
        </div>

        <Separator />

        <ScrollArea className="h-[65vh]">
          <div className="flex flex-col gap-y-4">
            <div className="border-b border-neutral-300 flex gap-x-4 px-2 pb-4 items-center">
              <UserAvatar user={creator} className="h-8 w-8 rounded-md" />
              <div>
                <p className="font-medium text-neutral-700">{creator.name}</p>

                <div className="flex items-center gap-x-1 text-muted-foreground text-[11px]">
                  <p>{creator.email}</p>

                  <span>•</span>

                  <p>Teacher</p>
                </div>
              </div>
            </div>

            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                sessionId={sessionId}
              />
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};

interface MemberCardProps {
  member: ExtendedMembershipDetails;
  sessionId: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, sessionId }) => {
  const joinedAs = member.isTeacher ? "Teacher" : "Student";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="border-b border-neutral-300 flex gap-x-4 px-2 pb-4">
          <UserAvatar user={member.user} className="h-8 w-8 rounded-md" />
          <div>
            <p className="font-medium text-neutral-700">{member.user.name}</p>

            <div className="flex items-center gap-x-1 text-muted-foreground text-[11px]">
              <p>{member.user.email}</p>

              <span>•</span>

              <p>{member.userId === sessionId ? "You" : joinedAs}</p>

              {member.userId !== sessionId && !member.isTeacher && (
                <>
                  <span>•</span>
                  <KickMemberDialog memberId={member.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
