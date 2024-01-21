import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { ExtendedClassroom } from "@/types";
import { ClassDropdown } from "@/components/dashboard/class-rooms/class-dropdown";
import { ClassContextMenu } from "@/components/dashboard/class-rooms/class-context-menu";

export const CreatedClassroom = ({
  classroom,
  isHolding = false,
}: {
  classroom: ExtendedClassroom;
  isHolding?: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: classroom.id,
      data: {
        dragType: "CLASSROOM",
        content: classroom,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (isDragging) {
    return (
      <div id="portal-item">
        <div className="flex items-center gap-x-1 opacity-60 py-1.5 px-2 tracking-tight text-gray-800 class-item">
          <GripVertical className="w-4 h-4 text-gray-800" />
          <p>{classroom.title}</p>
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
      <ClassContextMenu
        containerId={classroom.id}
        sectionType="CREATION"
        sectionId={classroom.sectionId}
        classroomName={classroom.title}
      >
        <Link
          onClick={() =>
            toast.loading("Getting your data together...", { duration: 2000 })
          }
          href={`/class/${classroom.id}`}
          className={cn(
            "text-gray-800 tracking-tight group hover:bg-neutral-300 transition rounded-md py-1 px-2 flex items-center justify-between",
            {
              "bg-neutral-300 text-sm opacity-60 cursor-grabbing": isHolding,
            }
          )}
        >
          <div className="flex items-center gap-x-1">
            <GripVertical className="w-4 h-4 text-gray-800 cursor-grab" />
            <p>{classroom.title}</p>
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
              containerId={classroom.id}
              sectionType="CREATION"
              sectionId={classroom.sectionId}
              classroomName={classroom.title}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>
        </Link>
      </ClassContextMenu>
    </div>
  );
};