import { useState } from "react";
import { Info, MoreHorizontal, Pen, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedEvent } from "@/types";
import { EditEventDialog } from "./dialog/edit-event-dialog";
import { EventInfoDialog } from "./dialog/info-event-dialog";
import { DeleteEventDialog } from "./dialog/delete-event-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface EventDropdownProps {
  event: ExtendedEvent;
}

export const EventDropdown: React.FC<EventDropdownProps> = ({ event }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <CustomTooltip text="More options">
              <div className="cursor-pointer rounded-md p-1 text-gray-700 transition hover:bg-neutral-300 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </div>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 min-w-40 sm:mr-0">
          <DropdownMenuItem
            className="text-[13px] text-gray-700 dark:text-gray-300"
            onClick={() => setIsEditOpen(true)}
          >
            <Pen className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-[13px] text-gray-700 dark:text-gray-300"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-[13px] text-gray-700 dark:text-gray-300"
            onClick={() => setIsInfoOpen(true)}
          >
            <Info className="mr-2 h-3.5 w-3.5" />
            About
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditOpen && (
        <EditEventDialog
          event={event}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && (
        <DeleteEventDialog
          eventId={event.id}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
      {isInfoOpen && (
        <EventInfoDialog
          event={event}
          isOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />
      )}
    </>
  );
};
