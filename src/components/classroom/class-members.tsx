import { UsersRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { ContainerVariants } from "@/lib/motion";
import { ExtendedMembershipDetails } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassMembersProps {
  members: ExtendedMembershipDetails[];
}

export const ClassMembers: React.FC<ClassMembersProps> = ({ members }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-6 space-y-4 h-full"
      >
        {members.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-y-4">
            <UsersRound className="h-16 w-16 text-neutral-800" />
            <p className="text-sm text-muted-foreground">
              No members joined yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col gap-y-4">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </ScrollArea>
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const MemberCard = ({ member }: { member: ExtendedMembershipDetails }) => {
  const joinedAs = member.isTeacher ? "Teacher" : "Student";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="border-b border-neutral-300 flex justify-between p-2 pb-4 items-end">
          <div className="flex items-center gap-x-4">
            <UserAvatar user={member.user} />
            <div className="space-y-1">
              <h5 className="font-semibold">{member.user.name}</h5>
              <p className="text-muted-foreground text-sm">
                {member.user.email}
              </p>
            </div>
          </div>
          <CustomTooltip text={`Joined as a ${joinedAs.toLowerCase()}`}>
            <div>
              <Badge>{joinedAs}</Badge>
            </div>
          </CustomTooltip>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
