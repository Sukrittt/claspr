import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { isCloseAllCreationToggle } from "@/atoms";
import { ExtendedClassroom, ExtendedSectionWithClassrooms } from "@/types";
import { CreateClassDialog } from "@/components/class-rooms/create-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithClassrooms;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);
  const [closeAllToggle] = useAtom(isCloseAllCreationToggle);

  useEffect(() => {
    setShowClassrooms(false);
  }, [closeAllToggle]);

  const handleShowClassrooms = () => {
    setShowClassrooms((prev) => !prev);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div
          className="flex items-center justify-between cursor-pointer text-gray-800 text-sm font-medium hover:bg-neutral-300 py-1 px-2 rounded-md transition group"
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
            <CreateClassDialog sectionId={section.id} />
          </div>
        </div>
        {showClassrooms && <ClassroomLists classrooms={section.classrooms} />}
      </motion.div>
    </AnimatePresence>
  );
};

interface ClassroomListsProps {
  classrooms: ExtendedClassroom[];
}

const ClassroomLists: React.FC<ClassroomListsProps> = ({ classrooms }) => {
  if (classrooms.length === 0) {
    return (
      <motion.p
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-gray-800 pl-[52px] text-sm"
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
          <Link
            href={`/class/${classroom.id}`}
            key={classroom.id}
            className="text-gray-800 tracking-tight group hover:bg-neutral-300 transition rounded-md py-1 px-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-x-1">
              <GripVertical className="w-4 h-4 text-gray-800" />
              <p>{classroom.title}</p>
            </div>
            <div
              className="hidden group-hover:block"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <MoreHorizontal
                className="w-4 h-4"
                onClick={() => toast.message("Coming Soon")}
              />
            </div>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
