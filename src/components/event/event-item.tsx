"use client";
import { useAtom } from "jotai";
import { format } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { MessageSquareText } from "lucide-react";

import { ExtendedEvent } from "@/types";
import { calendarModeAtom } from "@/atoms";
import { cn, getShortenedText } from "@/lib/utils";
import { useQueryChange } from "@/hooks/use-query-change";

interface EventItemProps {
  event: ExtendedEvent;
  isHolding?: boolean;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  isHolding = false,
}) => {
  const handleQueryChange = useQueryChange();
  const [calendarMode] = useAtom(calendarModeAtom);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      disabled: !!event.assignment,
      data: { content: event },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (isDragging) {
    return (
      <div
        className={cn(
          "rounded-xl border py-2 px-4 tracking-tight space-y-2 cursor-pointer bg-neutral-100 dark:bg-neutral-800/60 transition",
          {
            "px-2 py-1 rounded-lg": calendarMode === "month",
          }
        )}
      >
        <p className="text-sm text-neutral-800 dark:text-foreground">
          {getShortenedText(event.title, calendarMode === "week" ? 50 : 17)}
        </p>
        {calendarMode === "week" && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {format(new Date(event.rawEventDate), "MMMM do")},{" "}
              {format(event.eventDate, "h:mm a")}
            </p>
            {event.description && (
              <MessageSquareText className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => handleQueryChange("/calendar", { active: event.id })}
      className={cn(
        "rounded-xl border shadow-md py-2 px-4 tracking-tight space-y-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition",
        {
          "opacity-60 cursor-grabbing": isHolding,
          "px-2 py-1 rounded-lg": calendarMode === "month",
        }
      )}
    >
      <p className="text-sm text-neutral-800 dark:text-foreground">
        {getShortenedText(event.title, calendarMode === "week" ? 50 : 17)}
      </p>
      {calendarMode === "week" && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {format(new Date(event.rawEventDate), "MMMM do")},{" "}
            {format(event.eventDate, "h:mm a")}
          </p>
          {event.description && (
            <MessageSquareText className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
};
