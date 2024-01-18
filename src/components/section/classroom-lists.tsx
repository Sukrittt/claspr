import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { CreatedClassroom } from "./created-classroom";
import { JoinedMembership } from "./joined-membership";
import { ExtendedMembership, ExtendedClassroom } from "@/types";

interface ClassroomListsWithCreationProps {
  classrooms: ExtendedClassroom[];
}

export const ClassroomListsWithCreation: React.FC<
  ClassroomListsWithCreationProps
> = ({ classrooms }) => {
  if (classrooms.length === 0) {
    return (
      <motion.p
        variants={ContainerVariants}
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
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col pl-[52px] text-sm"
        onClick={() =>
          toast.loading("Getting your data together...", { duration: 2000 })
        }
      >
        {classrooms.map((classroom) => (
          <CreatedClassroom classroom={classroom} key={classroom.id} />
        ))}
      </motion.div>
    </AnimatePresence>
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
        variants={ContainerVariants}
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
    <AnimatePresence mode="wait">
      <div
        className="flex flex-col pl-[52px] text-sm"
        onClick={() =>
          toast.loading("Getting your data together...", { duration: 2000 })
        }
      >
        <motion.div
          variants={ContainerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {memberships.map((membership) => (
            <JoinedMembership key={membership.id} membership={membership} />
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
