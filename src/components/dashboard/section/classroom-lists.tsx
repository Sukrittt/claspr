import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ContainerHeightVariants } from "@/lib/motion";
import { CreatedClassroom } from "./created-classroom";
import { JoinedMembership } from "./joined-membership";
import { ExtendedMembership, MinifiedClassroom } from "@/types";

interface ClassroomListsWithCreationProps {
  classrooms: MinifiedClassroom[];
  isMenu?: boolean;
}

export const ClassroomListsWithCreation: React.FC<
  ClassroomListsWithCreationProps
> = ({ classrooms, isMenu }) => {
  if (classrooms.length === 0) {
    return (
      <motion.p
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "text-gray-800 dark:text-muted-foreground pl-[52px] text-[13.5px] pt-1",
          {
            "pl-9 text-xs": isMenu,
          }
        )}
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
      className={cn(
        "flex flex-col pl-[52px] text-sm max-h-[25vh] no-scrollbar overflow-y-auto",
        {
          "pl-6": isMenu,
        }
      )}
    >
      {classrooms.map((classroom) => (
        <CreatedClassroom
          classroom={classroom}
          key={classroom.id}
          isMenu={isMenu}
        />
      ))}
    </motion.div>
  );
};

interface ClassroomListsWithMembershipProps {
  memberships: ExtendedMembership[];
  isMenu?: boolean;
}

export const ClassroomListsWithMembership: React.FC<
  ClassroomListsWithMembershipProps
> = ({ memberships, isMenu = false }) => {
  if (memberships.length === 0) {
    return (
      <motion.p
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "text-gray-800 dark:text-muted-foreground pl-[52px] text-[13.5px] pt-1",
          {
            "pl-9 text-xs": isMenu,
          }
        )}
      >
        No classrooms in this section.
      </motion.p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col pl-[52px] text-sm max-h-[25vh] no-scrollbar overflow-y-auto",
        {
          "pl-6": isMenu,
        }
      )}
    >
      <motion.div
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {memberships.map((membership) => (
          <JoinedMembership
            key={membership.id}
            membership={membership}
            isMenu={isMenu}
          />
        ))}
      </motion.div>
    </div>
  );
};
