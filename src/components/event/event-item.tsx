import { format } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { MessageSquareText } from "lucide-react";

import { cn } from "@/lib/utils";
import { ExtendedEvent } from "@/types";
import { useQueryChange } from "@/hooks/use-query-change";

interface EventItemProps {
  event: ExtendedEvent;
  isHolding?: boolean;
  sessionId: string;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  sessionId,
  isHolding = false,
}) => {
  const handleQueryChange = useQueryChange();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      disabled: event.userId !== sessionId,
      data: { content: event },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (isDragging) {
    return (
      <div className="rounded-xl border py-2 px-4 tracking-tight space-y-2 cursor-pointer bg-neutral-100 transition">
        <p className="text-sm text-neutral-800">{event.title}</p>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {format(event.eventDate, "MMMM do, h:mm a")}
          </p>
          {event.description && (
            <MessageSquareText className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
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
        "rounded-xl border py-2 px-4 tracking-tight space-y-2 cursor-pointer hover:bg-neutral-100 transition",
        {
          "opacity-60 cursor-grabbing": isHolding,
        }
      )}
    >
      <p className="text-sm text-neutral-800">{event.title}</p>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          {format(event.eventDate, "MMMM do, h:mm a")}
        </p>
        {event.description && (
          <MessageSquareText className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};
