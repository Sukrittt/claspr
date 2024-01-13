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

export const CreateClassDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Create Class">
            <div className="p-2 flex items-center justify-center rounded-md hover:bg-accent cursor-pointer hover:text-gray-700 transition">
              <Plus className="h-4 w-4" />
              <div className="sr-only">Create Class</div>
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a class</DialogTitle>
          {/* <DialogDescription>Create a class for the students</DialogDescription> */}
        </DialogHeader>

        <CreateClassForm />
      </DialogContent>
    </Dialog>
  );
};
