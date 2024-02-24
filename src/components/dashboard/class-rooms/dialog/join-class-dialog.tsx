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
import { JoinClassForm } from "@/components/dashboard/class-rooms/form/join-class-form";

export const JoinClassDialog = ({ sectionId }: { sectionId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Join Class">
            <div className="flex items-center justify-center rounded-md text-gray-800 hover:bg-neutral-300 p-1 cursor-pointer hover:text-gray-700 transition">
              <Plus className="h-3.5 w-3.5" />
              <div className="sr-only">Join Class</div>
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a class</DialogTitle>
          <DialogDescription>
            Enter the class code provided by your teacher
          </DialogDescription>
        </DialogHeader>

        <JoinClassForm sectionId={sectionId} />
      </DialogContent>
    </Dialog>
  );
};
