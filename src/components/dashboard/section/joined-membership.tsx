import Link from "next/link";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { ExtendedMembership } from "@/types";
import { cn, getShortenedText } from "@/lib/utils";
import { ClassDropdown } from "@/components/dashboard/class-rooms/class-dropdown";

export const JoinedMembership = ({
  membership,
  isHolding = false,
  isMenu = false,
}: {
  membership: ExtendedMembership;
  isHolding?: boolean;
  isMenu?: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: membership.id,
      data: {
        dragType: "CLASSROOM",
        content: membership,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (isDragging) {
    return (
      <div id="portal-item">
        <div className="flex items-center gap-x-1 py-1.5 px-2 tracking-tight text-gray-800 dark:text-foreground">
          <GripVertical className="w-4 h-4 text-gray-800 dark:text-neutral-400" />
          <p>
            {getShortenedText(membership.classRoom.title, isMenu ? 18 : 50)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      id="always-on-show"
    >
      <Link
        href={`/c/${membership.classRoom.id}`}
        className={cn(
          "text-gray-800 dark:text-foreground tracking-tight group hover:bg-neutral-200 dark:hover:bg-neutral-700/60 transition rounded-md py-1 px-2 flex items-center justify-between",
          {
            "bg-neutral-200 dark:bg-neutral-700/60 text-sm opacity-60 cursor-grabbing":
              isHolding,
          }
        )}
      >
        <div className="flex items-center gap-x-1">
          <GripVertical className="w-4 h-4 text-gray-800 dark:text-neutral-400" />
          <p>
            {getShortenedText(
              membership.renamedClassroom ?? membership.classRoom.title,
              isMenu ? 18 : 50
            )}
          </p>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter}>
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
        </DndContext>
      </Link>
    </div>
  );
};
