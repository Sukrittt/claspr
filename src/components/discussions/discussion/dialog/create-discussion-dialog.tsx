import { useState } from "react";
import { Plus } from "lucide-react";
import { DiscussionType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { discussionPlaceholders } from "@/config/utils";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateDiscussionForm } from "@/components/discussions/discussion/form/create-discussions-form";

interface CreateDiscussionDialogProps {
  discussionType: DiscussionType;
  classroomId: string;
}

export const CreateDiscussionDialog: React.FC<CreateDiscussionDialogProps> = ({
  classroomId,
  discussionType,
}) => {
  const [open, setOpen] = useState(false);
  const dialogDetails = discussionPlaceholders[discussionType];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Start discussion">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogDetails.title}</DialogTitle>
          <DialogDescription>{dialogDetails.description}</DialogDescription>
        </DialogHeader>

        <CreateDiscussionForm
          classroomId={classroomId}
          discussionType={discussionType}
          closeModal={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
