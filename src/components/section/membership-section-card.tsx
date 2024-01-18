import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllMembershipToggle } from "@/atoms";
import { SectionDropdown } from "./section-dropdown";
import { ExtendedSectionWithMemberships } from "@/types";
import { SectionContextMenu } from "./section-context-menu";
import { ClassroomListsWithMembership } from "./classroom-lists";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      <SectionContextMenu
        sectionId={section.id}
        sectionName={section.name}
        sectionType={section.sectionType}
      >
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
              <EmojiPopover
                emojiUrl={section.emojiUrl}
                sectionId={section.id}
              />
              <p>{section.name}</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition",
              {
                "opacity-100": isDropdownOpen,
              }
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {section.isDefault ? (
              <CustomTooltip text="Immutable storage for classrooms.">
                <Info className="h-3.5 w-3.5" />
              </CustomTooltip>
            ) : (
              <SectionDropdown
                sectionId={section.id}
                sectionName={section.name}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                sectionType={section.sectionType}
              />
            )}
            <JoinClassDialog sectionId={section.id} />
          </div>
        </div>
      </SectionContextMenu>
      {showClassrooms && (
        <ClassroomListsWithMembership memberships={section.memberships} />
      )}
    </>
  );
};
