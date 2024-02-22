import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { ExtendedEvent } from "@/types";
import { getShortenedText } from "@/lib/utils";

interface EventCardProps {
  event: ExtendedEvent;
  classroomId: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, classroomId }) => {
  const router = useRouter();

  const handleEventClick = () => {
    if (event.assignment) {
      router.push(`/c/${classroomId}/a/${event.assignment.id}`);
    } else {
      router.push("/calendar");
    }
  };

  return (
    <div className="border-b px-4 pb-2 flex items-center justify-between">
      <div className="space-y-0.5">
        <div>
          <p
            onClick={handleEventClick}
            className="text-[14px] tracking-tight text-neutral-800 font-medium hover:underline underline-offset-4 cursor-pointer"
          >
            {event.title}
          </p>
          {event.description && (
            <p className="text-sm text-muted-foreground">
              {getShortenedText(event.description, 40)}
            </p>
          )}
        </div>
        <p className="text-[12px] tracking-tight font-semibold text-muted-foreground">
          {format(event.eventDate, "do MMM, h:mm a")}
        </p>
      </div>

      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
};
