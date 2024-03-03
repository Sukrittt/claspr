import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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
import { buttonVariants } from "@/components/ui/button";
import { RenameEventTitle } from "./rename-event-title";
import { useQueryChange } from "@/hooks/use-query-change";

interface EventSheetProps {
  isActive?: boolean;
  children: React.ReactNode;
  event: ExtendedEvent;
  sessionId: string;
}

export const EventSheet: React.FC<EventSheetProps> = ({
  children,
  event,
  isActive = false,
  sessionId,
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
          <DrawerHeader>
            <DrawerTitle>
              <RenameEventTitle
                eventId={event.id}
                initialTitle={event.title}
                isEditable={event.userId === sessionId}
              />
            </DrawerTitle>

            <div className="flex items-center justify-between">
              <DrawerDescription>
                {format(event.eventDate, "MMMM do, h:mm a")}
              </DrawerDescription>

              {event.assignment && (
                <Link
                  href={`/c/${event.assignment.classRoomId}/a/${event.assignment.id}`}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "text-muted-foreground"
                  )}
                >
                  View Assignment
                </Link>
              )}
            </div>
          </DrawerHeader>

          <EventEditor event={event} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
