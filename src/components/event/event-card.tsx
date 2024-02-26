import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { ExtendedEvent } from "@/types";
import { getShortenedText } from "@/lib/utils";
import { EventDropdown } from "./event-dropdown";
import { useQueryChange } from "@/hooks/use-query-change";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface EventCardProps {
  event: ExtendedEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();
  const handleQueryChange = useQueryChange();

  const handleEventClick = () => {
    if (event.assignment) {
      router.push(
        `/c/${event.assignment.classRoomId}/a/${event.assignment.id}`
      );
    } else {
      handleQueryChange("/calendar", { active: event.id });
    }
  };

  return (
    <div className="border-b px-4 pb-2 flex items-center justify-between">
      <div className="space-y-0.5">
        <p
          onClick={handleEventClick}
          className="text-[14px] tracking-tight text-neutral-800 font-medium hover:underline underline-offset-4 cursor-pointer"
        >
          {getShortenedText(event.title, 30)}{" "}
          {event.assignment && (
            <span className="text-xs text-muted-foreground">(assignment)</span>
          )}
        </p>
        <p className="text-[12px] tracking-tight font-semibold text-muted-foreground">
          {format(event.eventDate, "do MMM, h:mm a")}
        </p>
      </div>

      {event.assignment ? (
        <CustomTooltip text="Calendar View">
          <div
            onClick={() => handleQueryChange("/calendar", { active: event.id })}
            className="text-gray-700 hover:bg-neutral-300 p-1 rounded-md transition cursor-pointer"
          >
            <CalendarClock className="h-3.5 w-3.5" />
          </div>
        </CustomTooltip>
      ) : (
        <EventDropdown event={event} />
      )}
    </div>
  );
};
