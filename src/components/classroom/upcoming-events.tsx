import { ExtendedClassroomDetails } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpcomingEventsProps {
  classroom: ExtendedClassroomDetails;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  classroom,
}) => {
  return (
    <Card className="overflow-hidden border border-neutral-300 bg-neutral-100">
      <CardHeader className="bg-neutral-200 py-3 space-y-0">
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
        <CardDescription>
          Your upcoming events for the next 7 days{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-sm text-muted-foreground">
        Coming Soon...
      </CardContent>
    </Card>
  );
};
