import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateClassForm } from "./create-class-form";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const CreateClassDialog = ({ sectionId }: { sectionId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Create Classroom">
            <div className="flex items-center justify-center rounded-md hover:bg-neutral-400/70 p-1 cursor-pointer hover:text-gray-700 transition">
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
  );
};
