import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddDescriptionForm } from "./add-description-form";

interface AddescriptionDialogProps {
  classroomId: string;
  children: React.ReactNode;
  description?: string;
}

export const AddDescriptionDialog: React.FC<AddescriptionDialogProps> = ({
  children,
  classroomId,
  description,
}) => {
  const [open, setOpen] = useState(false);

  const dialogTitle = description ? "Edit description" : "Add a description";

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            This will help us provide more context to our AI.
          </DialogDescription>
        </DialogHeader>

        <AddDescriptionForm
          classroomId={classroomId}
          description={description}
          closeModal={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
