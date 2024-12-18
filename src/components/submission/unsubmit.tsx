import { useEffect, useState } from "react";
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
import { useUnsubmitSubmission } from "@/hooks/submission";

interface UnsubmitProps {
  assignmentId: string;
  submissionId: string;
}

export const Unsubmit: React.FC<UnsubmitProps> = ({
  assignmentId,
  submissionId,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate: unsubmit, isLoading } = useUnsubmitSubmission({
    closeModal: () => setOpen(false),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "u" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-8 text-xs w-full"
          variant="outline"
          disabled={isLoading}
        >
          Unsubmit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to unsubmit your work?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You may submit your work at any time before the deadline, provided
            that your teacher permits late submissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => unsubmit({ assignmentId, submissionId })}
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
