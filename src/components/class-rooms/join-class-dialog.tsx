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
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
