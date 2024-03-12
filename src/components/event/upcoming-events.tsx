"use client";
import Link from "next/link";
import { CalendarDays, PartyPopper } from "lucide-react";

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
import { CreateEventDialog } from "./dialog/create-event-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { UpcomingEventSkeleton } from "@/components/skeletons/upcoming-event-skeleton";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { trpc } from "@/trpc/client";

interface UpcomingEventsProps {
  classroomId?: string;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  classroomId,
}) => {
  const mounted = useMounted();
  const [clientDate, setClientDate] = useState<Date | undefined>(undefined);

  // const {
  //   data: events,
  //   isLoading,
  //   refetch,
  // } = useGetUpcomingEvents(classroomId, undefined, clientDate);

  const { data: events, isLoading } = trpc.event.getEvents.useQuery({
    classroomId,
    date: undefined,
    clientDate,
  });

  useEffect(() => {
    if (!mounted) return;

    setClientDate(new Date());
    console.log("client date", format(new Date(), "MM dd yyyy"));
  }, [mounted]);

  console.log("current date", format(clientDate ?? new Date(), "MM dd yyyy"));
  console.log("has client date", !!clientDate);

  return (
    <Card className="h-full">
      <CardHeader className="border-b py-2.5">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <CardDescription className="text-[13px]">
              Upcoming events for the next 7 days
            </CardDescription>
          </div>

          <div className="flex items-center gap-x-2">
            <CustomTooltip text="Your Calendar">
              <Link
                href="/calendar"
                className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
              >
                <CalendarDays className="h-3.5 w-3.5" />
              </Link>
            </CustomTooltip>
            {!classroomId && <CreateEventDialog />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 px-0">
        <ScrollArea
          className={cn("h-[25vh] pr-0", {
            "h-[30vh]": !!classroomId,
          })}
        >
          <div className="flex flex-col gap-y-2">
            {isLoading || !clientDate ? (
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
