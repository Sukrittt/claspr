import Link from "next/link";
import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ExtendedEvent } from "@/types";
import { EventEditor } from "./event-editor";
import { useMounted } from "@/hooks/use-mounted";
import { EventDropdown } from "./event-dropdown";
import { Separator } from "@/components/ui/separator";
import { RenameEventTitle } from "./rename-event-title";
import { useQueryChange } from "@/hooks/use-query-change";

interface EventSheetProps {
  isActive?: boolean;
  children: React.ReactNode;
  event: ExtendedEvent;
}

export const EventSheet: React.FC<EventSheetProps> = ({
  children,
  event,
  isActive = false,
}) => {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const handleQueryChange = useQueryChange();

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  useEffect(() => {
    if (open || !mounted) return;

    handleQueryChange("/calendar", { active: null });
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={(val) => setOpen(val)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="max-w-2xl mx-auto w-full">
          <DrawerHeader
            className={cn("px-0", {
              "px-4": !event.assignment,
            })}
          >
            <div className="flex justify-between w-full">
              <DrawerTitle className="w-full">
                <RenameEventTitle
                  eventId={event.id}
                  initialTitle={event.title}
                  isEditable={!!!event.assignment} //if it's not an assignment
                  date={startOfDay(event.eventDate)}
                />
              </DrawerTitle>
              {!event.assignment && <EventDropdown event={event} />}
            </div>

            <div className="flex items-center gap-x-2">
              <DrawerDescription>
                {format(new Date(event.rawEventDate), "MMMM do")},{" "}
                {format(event.eventDate, "h:mm a")}
              </DrawerDescription>

              {event.assignment && (
                <>
                  <Separator orientation="vertical" className="h-4" />

                  <Link
                    href={`/c/${event.assignment.classRoomId}/a/${event.assignment.id}`}
                    className="text-muted-foreground text-[13px] hover:underline underline-offset-4"
                  >
                    View Assignment
                  </Link>
                </>
              )}
            </div>
          </DrawerHeader>

          <EventEditor event={event} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
