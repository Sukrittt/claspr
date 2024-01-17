import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllCreationToggle } from "@/atoms";
import { SectionDropdown } from "./section-dropdown";
import { ExtendedSectionWithClassrooms } from "@/types";
import { ClassroomListsWithCreation } from "./classroom-lists";
import { CreateClassDialog } from "@/components/class-rooms/create-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithClassrooms;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionItem section={section} />
      </motion.div>
    </AnimatePresence>
  );
};

const SectionItem = ({
  section,
}: {
  section: ExtendedSectionWithClassrooms;
}) => {
  const [closeAllToggle] = useAtom(isCloseAllCreationToggle);
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);

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
            <EmojiPopover emojiUrl={section.emojiUrl} sectionId={section.id} />
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
          {!section.isDefault && (
            <SectionDropdown
              sectionId={section.id}
              sectionName={section.name}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              sectionType={section.sectionType}
            />
          )}
          <CreateClassDialog sectionId={section.id} />
        </div>
      </div>
      {showClassrooms && (
        <ClassroomListsWithCreation classrooms={section.classrooms} />
      )}
    </>
  );
};
