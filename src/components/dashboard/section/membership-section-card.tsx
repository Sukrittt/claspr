import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllMembershipToggle } from "@/atoms";
import { SectionDropdown } from "./section-dropdown";
import { ExtendedSectionWithMemberships } from "@/types";
import { ClassroomListsWithMembership } from "./classroom-lists";
import { JoinClassDialog } from "@/components/dashboard/class-rooms/dialog/join-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithMemberships;
  isMenu?: boolean;
}

export const MembershipSectionCard: React.FC<SectionCardProps> = ({
  section,
  isMenu = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: { dragType: "SECTION", content: section },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        id="always-on-show"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="focus:outline-none"
      >
        <MembershipItem
          section={section}
          isDragging={isDragging}
          isMenu={isMenu}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export const MembershipItem = ({
  section,
  isHolding = false,
  isDragging = false,
  isMenu = false,
}: {
  section: ExtendedSectionWithMemberships;
  isHolding?: boolean;
  isDragging?: boolean;
  isMenu?: boolean;
}) => {
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);
  const [closeAllToggle] = useAtom(isCloseAllMembershipToggle);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { setNodeRef, active, isOver } = useDroppable({
    id: section.id,
    data: {
      content: section,
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (closeAllToggle !== null) {
      setShowClassrooms(false);
    }
  }, [closeAllToggle]);

  const handleShowClassrooms = () => {
    setShowClassrooms((prev) => !prev);
  };

  if (isDragging) {
    return (
      <>
        <div className="flex items-center gap-x-1 text-sm font-medium py-1 px-2 opacity-60">
          <ChevronRight
            className={cn("w-4 h-4 transition", {
              "rotate-90": showClassrooms,
            })}
          />
          <div className="flex items-center gap-x-2">
            <EmojiPopover
              sectionType="MEMBERSHIP"
              emojiUrl={section.emojiUrl}
              sectionId={section.id}
            />
            <p className="text-[13.5px]">{section.name}</p>
          </div>
        </div>
        {showClassrooms && (
          <ClassroomListsWithMembership
            memberships={section.memberships}
            isMenu={isMenu}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between cursor-pointer text-gray-800 text-sm font-medium hover:bg-neutral-200/60 py-1 px-2 rounded-md transition group",
          {
            "bg-neutral-200/60 duration-500":
              isOver && active?.data.current?.dragType === "CLASSROOM",
            "bg-neutral-200/60 text-sm opacity-60 cursor-grabbing": isHolding,
          }
        )}
        ref={setNodeRef}
        onClick={handleShowClassrooms}
      >
        <div className="flex items-center gap-x-1">
          <ChevronRight
            className={cn("w-4 h-4 transition", {
              "rotate-90": showClassrooms || isHolding,
            })}
          />
          <div className="flex items-center gap-x-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <EmojiPopover
                emojiUrl={section.emojiUrl}
                sectionType="MEMBERSHIP"
                sectionId={section.id}
              />
            </div>
            <p className="text-[13.5px]">{section.name}</p>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition",
              {
                "opacity-100": isDropdownOpen,
              }
            )}
          >
            <SectionDropdown
              sectionId={section.id}
              sectionName={section.name}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              sectionType={section.sectionType}
              isDefault={section.isDefault}
            />
            <JoinClassDialog sectionId={section.id} />
          </div>
        </DndContext>
      </div>
      <AnimatePresence mode="wait">
        {(showClassrooms || isHolding) && (
          <div
            className={cn({
              "opacity-60": isHolding,
            })}
          >
            <ClassroomListsWithMembership
              memberships={section.memberships}
              isMenu={isMenu}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
