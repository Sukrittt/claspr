import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ContainerVariants, MemberCardVariants } from "@/lib/motion";
import { ExtendedMembership, ExtendedSectionWithMemberships } from "@/types";
import { JoinClassDialog } from "@/components/class-rooms/join-class-dialog";

interface SectionCardProps {
  section: ExtendedSectionWithMemberships;
}

export const MembershipSectionCard: React.FC<SectionCardProps> = ({
  section,
}) => {
  const [showClassrooms, setShowClassrooms] = useState(section.isDefault);

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
          onClick={() => setShowClassrooms((prev) => !prev)}
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
        {showClassrooms && <ClassroomLists memberships={section.memberships} />}
      </motion.div>
    </AnimatePresence>
  );
};

interface ClassroomListsProps {
  memberships: ExtendedMembership[];
}

const ClassroomLists: React.FC<ClassroomListsProps> = ({ memberships }) => {
  if (memberships.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={MemberCardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col pl-[52px] text-sm"
        onClick={() =>
          toast.loading("Getting your data together...", { duration: 2000 })
        }
      >
        {memberships.map((membership) => (
          <Link
            href={`/class/${membership.id}`}
            key={membership.id}
            className="text-gray-800 tracking-tight group hover:bg-neutral-300 transition rounded-md py-1 px-2 flex items-center justify-between"
          >
            <p>{membership.classRoom.title}</p>
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
