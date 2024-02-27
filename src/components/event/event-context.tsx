import { useState } from "react";
import { createPortal } from "react-dom";
import { format, isSameDay, startOfDay } from "date-fns";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { Events } from "./events";
import { ExtendedEvent } from "@/types";
import { EventItem } from "./event-item";
import { useEditEvent } from "@/hooks/event";

export const EventContext = ({ calendarDates }: { calendarDates: Date[] }) => {
  const [activeEventEl, setActiveEventEl] = useState<ExtendedEvent | null>(
    null
  );

  const { mutate: moveEvent } = useEditEvent({ closeModal: undefined });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveEventEl(active.data.current?.content as ExtendedEvent);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const overDate = over.data.current?.content as Date;
    const activeEvent = active.data.current?.content as ExtendedEvent;

    const activeEventId = activeEvent.id;
    const activeEventDate = activeEvent.eventDate;

    if (isSameDay(activeEventDate, overDate)) return;

    const newActiveDate = startOfDay(activeEventDate);

    //SERVER UPDATE
    moveEvent({
      eventId: activeEventId,
      eventDate: overDate,
      initialDate: newActiveDate, //USED FOR CLIENT ONLY
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="grid grid-cols-7 place-items-center gap-4 h-[95%]">
        {calendarDates.map((date) => (
          <DateColumn key={date.toISOString()} date={date} />
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeEventEl && <EventItem event={activeEventEl} isHolding />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

const DateColumn = ({ date }: { date: Date }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: {
      content: date,
    },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col gap-y-4 h-full w-full">
      <div
        className={cn("rounded-xl border transition duration-300 p-4 w-full", {
          "bg-neutral-800": isOver || isSameDay(date, new Date()),
        })}
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col gap-y-2 items-center">
            <span
              className={cn("text-sm tracking-tight text-muted-foreground", {
                "text-neutral-100": isOver || isSameDay(date, new Date()),
              })}
            >
              {format(date, "EEEE")}
            </span>
            <span
              className={cn("text-2xl font-semibold text-neutral-800", {
                "text-neutral-100": isOver || isSameDay(date, new Date()),
              })}
            >
              {format(date, "d")}
            </span>
          </div>
        </div>
      </div>

      <Events date={date} />
    </div>
  );
};
