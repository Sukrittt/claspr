import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JoinClassForm } from "./join-class-form";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const JoinClassDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Join Class">
            <div className="p-2 flex items-center justify-center rounded-md hover:bg-accent cursor-pointer hover:text-gray-700 transition">
              <Plus className="h-4 w-4" />
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

        <JoinClassForm />
      </DialogContent>
    </Dialog>
  );
};
