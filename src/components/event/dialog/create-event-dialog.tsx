import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateEventForm } from "@/components/event/form/create-event-form";

export const CreateEventDialog = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <div>
            <CustomTooltip text="Create Event">
              <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200">
                <Plus className="h-3.5 w-3.5" />
                <div className="sr-only">Create event</div>
              </div>
            </CustomTooltip>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an event</DialogTitle>
          <DialogDescription>
            Stay organized and keep track of important dates
          </DialogDescription>
        </DialogHeader>

        <CreateEventForm closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
