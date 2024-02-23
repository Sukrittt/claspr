"use client";
import { PartyPopper } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EventCard } from "./event-card";
import { useGetUpcomingEvents } from "@/hooks/event";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpcomingEventSkeleton } from "@/components/skeletons/upcoming-event-skeleton";

interface UpcomingEventsProps {
  classroomId?: string;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  classroomId,
}) => {
  const { data: events, isLoading } = useGetUpcomingEvents(classroomId);

  return (
    <Card className="h-full">
      <CardHeader className="border-b py-2.5 space-y-0">
        <CardTitle className="text-base">Upcoming Events</CardTitle>
        <CardDescription className="text-[13px]">
          Your upcoming events for the next 7 days{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 px-0">
        <ScrollArea
          className={cn("h-[25vh] pr-0", {
            "h-[30vh]": !!classroomId,
          })}
        >
          <div className="flex flex-col gap-y-2">
            {isLoading ? (
              <UpcomingEventSkeleton />
            ) : !events || events.length === 0 ? (
              <div
                className={cn(
                  "h-[25vh] flex flex-col text-muted-foreground text-[13px] justify-center items-center gap-y-2",
                  {
                    "h-[30vh]": !!classroomId,
                  }
                )}
              >
                <PartyPopper className="h-5 w-5" />
                <p>Empty schedule for a week!</p>
              </div>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
