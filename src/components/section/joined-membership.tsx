import Link from "next/link";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { ExtendedMembership } from "@/types";
import { GripVertical, MoreHorizontal } from "lucide-react";

export const JoinedMembership = ({
  membership,
  isHolding = false,
}: {
  membership: ExtendedMembership;
  isHolding?: boolean;
}) => {
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
          <p>{membership.classRoom.title}</p>
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
    </div>
  );
};
