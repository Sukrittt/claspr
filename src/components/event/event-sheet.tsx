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
import { ExtendedEvent } from "@/types";
import { Editor } from "@/components/editor/Editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryChange } from "@/hooks/use-query-change";
import { useMounted } from "@/hooks/use-mounted";

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
          <DrawerHeader>
            <DrawerTitle>{event.title}</DrawerTitle>
            <DrawerDescription>
              {format(event.eventDate, "MMMM do, h:mm a")}
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="h-[50vh]">
            <Editor
              disableAI
              content={event.description}
              placeholder="What is this event about?"
              //   getDebouncedContent
            />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
