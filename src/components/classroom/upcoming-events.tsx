import { ExtendedClassroomDetails } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useGetUpcomingEvents } from "@/hooks/event";

interface UpcomingEventsProps {
  classroom: ExtendedClassroomDetails;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  classroom,
}) => {
  // const { data: events, isLoading } = useGetUpcomingEvents(classroom.id);

  return (
    <Card className="h-full">
      <CardHeader className="border-b py-2.5 space-y-0">
        <CardTitle className="text-base">Upcoming Events</CardTitle>
        <CardDescription>
          Your upcoming events for the next 7 days{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-sm text-muted-foreground">
        {/* {isLoading ? (
          <p>Loading...</p>
        ) : !events || events.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          <p>{events.length} events.</p>
        )} */}
        Coming Soon...
      </CardContent>
    </Card>
  );
};
