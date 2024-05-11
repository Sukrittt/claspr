"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { format, isSameDay } from "date-fns";
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
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";
import { Events } from "./events";
import { ExtendedEvent } from "@/types";
import { EventItem } from "./event-item";
import { CalendarMode } from "@/types/event";
import { useEditEvent } from "@/hooks/event";
import { activeDateAtom, overDateAtom } from "@/atoms";

interface EventContextProps {
  calendarDates: Date[];
  sessionId: string;
  mode: CalendarMode;
}

export const EventContext: React.FC<EventContextProps> = ({
  calendarDates,
  sessionId,
  mode,
}) => {
  const [activeEventEl, setActiveEventEl] = useState<ExtendedEvent | null>(
    null
  );

  const [, setOverDate] = useAtom(overDateAtom);
  const [, setActiveDateObj] = useAtom(activeDateAtom);

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

    const activeEvent = active.data.current?.content as ExtendedEvent;

    // Only allow the user to drag their own events
    if (activeEvent.userId !== sessionId) return;

    setActiveDateObj({
      event: activeEvent,
      dateColumn: activeEvent.eventDate,
    });

    setActiveEventEl(activeEvent);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const overDate = over.data.current?.content as Date;
    const activeEvent = active.data.current?.content as ExtendedEvent;

    // Only allow the user to drag their own events
    if (activeEvent.userId !== sessionId) return;

    const activeEventId = activeEvent.id;
    const activeEventDate = new Date(activeEvent.rawEventDate);

    if (isSameDay(activeEventDate, overDate)) return;

    //CLIENT UPDATE
    setOverDate(overDate);

    //SERVER UPDATE
    moveEvent({
      eventId: activeEventId,
      eventDate: overDate,
      isMoving: true,
    });

    setActiveEventEl(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div
        className={cn(
          "flex place-items-center gap-4 overflow-x-auto no-scrollbar h-[95%]",
          {
            "grid grid-cols-7": mode === "month",
          }
        )}
      >
        {calendarDates.map((date) => (
          <DateColumn key={date.toISOString()} date={date} mode={mode} />
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

interface DateColumnProps {
  date: Date;
  mode: CalendarMode;
}

const DateColumn: React.FC<DateColumnProps> = ({ date, mode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: {
      content: date,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-y-4 h-full w-full min-w-[10rem] flex-1"
    >
      <div
        className={cn(
          "rounded-xl border shadow-md transition duration-300 p-4 w-full relative",
          {
            "h-[150px] pl-2": mode === "month",
          }
        )}
      >
        {mode === "week" && (
          <span className="text-sm tracking-tight text-muted-foreground dark:text-foreground">
            {format(date, "EEE")}
          </span>
        )}
        <div
          className={cn("absolute top-2 right-3", {
            "top-[18px]": mode === "week",
          })}
        >
          <span
            className={cn(
              "py-0.5 px-1 rounded-md transition text-sm text-neutral-800 dark:text-foreground",
              {
                "bg-[#f15550]": isOver || isSameDay(date, new Date()),
              }
            )}
          >
            {format(date, "d")}
          </span>
        </div>

        {mode === "month" && <Events date={date} />}
      </div>

      {mode === "week" && <Events date={date} />}
    </div>
  );
};
