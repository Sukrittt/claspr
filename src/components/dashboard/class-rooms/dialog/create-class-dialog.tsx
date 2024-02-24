import { Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateClassForm } from "@/components/dashboard/class-rooms/form/create-class-form";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const CreateClassDialog = ({ sectionId }: { sectionId: string }) => {
  //This is just a workaround to prevent dropdown drag event to be propogated.
  //Note. stopPropagation() does NOT work here.
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "DUMMY",
  });

  return (
    <div {...attributes} {...listeners} ref={setNodeRef}>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <CustomTooltip text="Create Classroom">
              <div className="flex items-center justify-center rounded-md text-gray-800 hover:bg-neutral-300 p-1 cursor-pointer hover:text-gray-700 transition">
                <Plus className="h-3.5 w-3.5" />
                <div className="sr-only">Create Classroom</div>
              </div>
            </CustomTooltip>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a classroom</DialogTitle>
            <DialogDescription>
              Start a new class by providing essential details.
            </DialogDescription>
          </DialogHeader>

          <CreateClassForm sectionId={sectionId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
