import { User } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { ContainerVariants } from "@/lib/motion";
import { ExtendedMembershipDetails } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassMembersProps {
  members: ExtendedMembershipDetails[];
  creator: User;
}

export const ClassMembers: React.FC<ClassMembersProps> = ({
  members,
  creator,
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
        <AnimatePresence mode="wait">
          <ScrollArea className="h-[500px]">
            <div className="flex flex-col gap-y-4">
              <div className="border-b border-neutral-300 flex justify-between p-2 pb-4 items-end">
                <div className="flex items-center gap-x-4">
                  <UserAvatar user={creator} className="h-8 w-8 rounded-md" />
                  <div>
                    <p className="font-medium text-neutral-700">
                      {creator.name}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {creator.email}
                    </p>
                  </div>
                </div>
                <CustomTooltip text="You created this classroom">
                  <div>
                    <Badge variant="outline">You</Badge>
                  </div>
                </CustomTooltip>
              </div>
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </ScrollArea>
        </AnimatePresence>
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
            <UserAvatar user={member.user} className="h-8 w-8 rounded-md" />
            <div>
              <p className="font-medium text-neutral-700">{member.user.name}</p>
              <p className="text-muted-foreground text-[11px]">
                {member.user.email}
              </p>
            </div>
          </div>
          <CustomTooltip text={`Joined as a ${joinedAs.toLowerCase()}`}>
            <div>
              <Badge variant="outline">{joinedAs}</Badge>
            </div>
          </CustomTooltip>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
