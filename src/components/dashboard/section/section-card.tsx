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
import { ChevronRight } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";

import { EmojiPopover } from "./emoji-popover";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllCreationToggle } from "@/atoms";
import { cn, getShortenedText } from "@/lib/utils";
import { SectionDropdown } from "./section-dropdown";
import { ExtendedSectionWithClassrooms } from "@/types";
import { ClassroomListsWithCreation } from "./classroom-lists";
import { CreateClassDialog } from "@/components/dashboard/class-rooms/dialog/create-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithClassrooms;
  isMenu?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  isMenu,
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
        data-no-dnd="true"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="focus:outline-none"
      >
        <SectionItem
          section={section}
          isDragging={isDragging}
          isMenu={isMenu}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export const SectionItem = ({
  section,
  isHolding = false,
  isDragging = false,
  isMenu = false,
}: {
  section: ExtendedSectionWithClassrooms;
  isHolding?: boolean;
  isDragging?: boolean;
  isMenu?: boolean;
}) => {
  const [closeAllToggle] = useAtom(isCloseAllCreationToggle);
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { setNodeRef, isOver, active } = useDroppable({
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

  const handleToggleOpenClassrooms = () => {
    setShowClassrooms((prev) => !prev);
  };

  if (isDragging) {
    return (
      <>
        <div className="flex items-center gap-x-1 text-sm font-medium py-1 px-2">
          <ChevronRight
            className={cn("w-4 h-4 transition", {
              "rotate-90": showClassrooms,
            })}
          />
          <div className="flex items-center gap-x-2">
            <EmojiPopover
              sectionType="CREATION"
              emojiUrl={section.emojiUrl}
              sectionId={section.id}
            />
            <p className="text-[13.5px]">
              {getShortenedText(section.name, isMenu ? 15 : 25)}
            </p>
          </div>
        </div>
        {showClassrooms && (
          <div
            className={cn({
              "opacity-60": isHolding,
            })}
          >
            <ClassroomListsWithCreation classrooms={section.classrooms} />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between cursor-pointer text-gray-800 dark:text-foreground text-sm font-medium hover:bg-neutral-200/60 dark:hover:bg-neutral-800 py-1 px-2 rounded-md transition group",
          {
            "bg-neutral-200/60 dark:bg-neutral-800 duration-500":
              isOver && active?.data.current?.dragType === "CLASSROOM",
            "bg-neutral-200/60 dark:bg-neutral-800 text-sm opacity-60 cursor-grabbing":
              isHolding,
          }
        )}
        ref={setNodeRef}
        onClick={handleToggleOpenClassrooms}
      >
        <div className="flex items-center gap-x-1">
          <ChevronRight
            className={cn("w-4 h-4 transition", {
              "rotate-90": showClassrooms,
              "rotate-0": isHolding,
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
                sectionId={section.id}
                sectionType="CREATION"
              />
            </div>
            <p className="text-[13.5px]">
              {getShortenedText(section.name, isMenu ? 15 : 25)}
            </p>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "flex items-center gap-x-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition",
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
            <CreateClassDialog sectionId={section.id} />
          </div>
        </DndContext>
      </div>
      <AnimatePresence mode="wait">
        {showClassrooms && !isHolding && (
          <div
            className={cn({
              "opacity-60": isHolding,
            })}
          >
            <ClassroomListsWithCreation
              classrooms={section.classrooms}
              isMenu={isMenu}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
