import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventCard } from "./event-card";
import { useGetUpcomingEvents } from "@/hooks/event";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UpcomingEventsProps {
  classroomId: string;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  classroomId,
}) => {
  const { data: events, isLoading } = useGetUpcomingEvents(classroomId);

  return (
    <Card className="h-full">
      <CardHeader className="border-b py-2.5 space-y-0">
        <CardTitle className="text-base">Upcoming Events</CardTitle>
        <CardDescription>
          Your upcoming events for the next 7 days{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 px-0">
        <ScrollArea className="h-[30vh] pr-0">
          <div className="flex flex-col gap-y-2">
            {isLoading ? (
              <p>Loading...</p>
            ) : !events || events.length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  classroomId={classroomId}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
