import { toast } from "sonner";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllMembershipToggle } from "@/atoms";
import { ExtendedSectionWithMemberships } from "@/types";
import { ClassroomListsWithMembership } from "./classroom-lists";
import { JoinClassDialog } from "@/components/class-rooms/join-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithMemberships;
}

export const MembershipSectionCard: React.FC<SectionCardProps> = ({
  section,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <MembershipItem section={section} />
      </motion.div>
    </AnimatePresence>
  );
};

const MembershipItem = ({
  section,
}: {
  section: ExtendedSectionWithMemberships;
}) => {
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);
  const [closeAllToggle] = useAtom(isCloseAllMembershipToggle);

  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
    data: {
      content: section,
    },
  });

  useEffect(() => {
    if (closeAllToggle !== null) {
      setShowClassrooms(false);
    }
  }, [closeAllToggle]);

  const handleShowClassrooms = () => {
    setShowClassrooms((prev) => !prev);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between cursor-pointer text-gray-800 text-sm font-medium hover:bg-neutral-300 py-1 px-2 rounded-md transition group",
          {
            "bg-neutral-300 duration-500": isOver,
          }
        )}
        ref={setNodeRef}
        onClick={handleShowClassrooms}
      >
        <div className="flex items-center gap-x-1">
          <ChevronRight
            className={cn("w-4 h-4 transition", {
              "rotate-90": showClassrooms,
            })}
          />
          <div className="flex items-center gap-x-2">
            {section.emoji ? (
              <span>{section.emoji}</span>
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <p>{section.name}</p>
          </div>
        </div>
        <div
          className="items-center gap-x-2 hidden group-hover:flex transition"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal
            className="w-4 h-4"
            onClick={() => toast.message("Coming Soon")}
          />
          <JoinClassDialog sectionId={section.id} />
        </div>
      </div>
      {showClassrooms && (
        <ClassroomListsWithMembership memberships={section.memberships} />
      )}
    </>
  );
};
