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

interface AdDescriptionDialogProps {
  classroomId: string;
  children: React.ReactNode;
}

export const AddDescriptionDialog: React.FC<AdDescriptionDialogProps> = ({
  children,
  classroomId,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a description</DialogTitle>
          <DialogDescription>
            This will help us provide more context to our AI.
          </DialogDescription>
        </DialogHeader>

        <UpdateDescriptionForm classroomId={classroomId} />
      </DialogContent>
    </Dialog>
  );
};
