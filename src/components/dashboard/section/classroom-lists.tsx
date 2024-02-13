import { motion } from "framer-motion";

import { ContainerHeightVariants } from "@/lib/motion";
import { CreatedClassroom } from "./created-classroom";
import { JoinedMembership } from "./joined-membership";
import { ExtendedMembership, MinifiedClassroom } from "@/types";

interface ClassroomListsWithCreationProps {
  classrooms: MinifiedClassroom[];
}

export const ClassroomListsWithCreation: React.FC<
  ClassroomListsWithCreationProps
> = ({ classrooms }) => {
  if (classrooms.length === 0) {
    return (
      <motion.p
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-gray-800 pl-[52px] text-sm pt-1"
      >
        No classrooms in this section.
      </motion.p>
    );
  }

  return (
    <motion.div
      variants={ContainerHeightVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col pl-[52px] text-sm"
    >
      {classrooms.map((classroom) => (
        <CreatedClassroom classroom={classroom} key={classroom.id} />
      ))}
    </motion.div>
  );
};

interface ClassroomListsWithMembershipProps {
  memberships: ExtendedMembership[];
}

export const ClassroomListsWithMembership: React.FC<
  ClassroomListsWithMembershipProps
> = ({ memberships }) => {
  if (memberships.length === 0) {
    return (
      <motion.p
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-gray-800 pl-[52px] text-sm pt-1"
      >
        No classrooms in this section.
      </motion.p>
    );
  }

  return (
    <div className="flex flex-col pl-[52px] text-sm">
      <motion.div
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {memberships.map((membership) => (
          <JoinedMembership key={membership.id} membership={membership} />
        ))}
      </motion.div>
    </div>
  );
};
