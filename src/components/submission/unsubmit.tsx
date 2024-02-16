import { Loader2 } from "lucide-react";

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
  const { mutate: unsubmit, isLoading } = useUnsubmitSubmission();

  return (
    <Button
      className="h-8 text-xs w-full"
      variant="outline"
      disabled={isLoading}
      onClick={() => unsubmit({ assignmentId, submissionId })}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unsubmit"}
    </Button>
  );
};
