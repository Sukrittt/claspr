import Link from "next/link";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { ExtendedMembership } from "@/types";
import { ClassDropdown } from "@/components/class-rooms/class-dropdown";

export const JoinedMembership = ({
  membership,
  isHolding = false,
}: {
  membership: ExtendedMembership;
  isHolding?: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: membership.id,
      data: {
        type: "MEMBERSHIP" as const,
        content: membership,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (isDragging) {
    return (
      <div className="flex items-center gap-x-1 py-1 px-2 tracking-tight text-gray-800">
        <GripVertical className="w-4 h-4 text-gray-800" />
        <p>{membership.classRoom.title}</p>
      </div>
    );
  }

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <Link
        href={`/class/${membership.id}`}
        className={cn(
          "text-gray-800 tracking-tight group hover:bg-neutral-300 transition rounded-md py-1 px-2 flex items-center justify-between",
          {
            "bg-neutral-300 text-sm opacity-60 cursor-grabbing": isHolding,
          }
        )}
      >
        <div className="flex items-center gap-x-1">
          <GripVertical className="w-4 h-4 text-gray-800" />
          <p>{membership.renamedClassroom ?? membership.classRoom.title}</p>
        </div>
        <div
          className={cn("opacity-0 group-hover:opacity-100", {
            "opacity-100": isDropdownOpen,
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ClassDropdown
            containerId={membership.id}
            sectionType="MEMBERSHIP"
            sectionId={membership.sectionId}
            classroomName={
              membership.renamedClassroom ?? membership.classRoom.title
            }
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </Link>
    </div>
  );
};
