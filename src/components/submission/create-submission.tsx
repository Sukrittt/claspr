import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCreateSubmission } from "@/hooks/submission";

interface CreateSubmissionProps {
  assignmentId: string;
  disabled: boolean;
}

export const CreateSubmission: React.FC<CreateSubmissionProps> = ({
  disabled,
  assignmentId,
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: createSubmission, isLoading } = useCreateSubmission({
    closeModal: () => setOpen(false),
  });

  const handleCreateSubmission = () => {
    createSubmission({
      assignmentId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled || isLoading} className="h-8 text-xs w-full">
          Submit Assignment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to turn in your work?</AlertDialogTitle>
          <AlertDialogDescription>
            You have the option to retract your submission at any time. However,
            if late submissions are not permitted, you cannot resubmit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={handleCreateSubmission}
            className="pt-2"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-[52px] animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
