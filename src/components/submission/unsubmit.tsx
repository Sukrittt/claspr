import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUnsubmitSubmission } from "@/hooks/submission";

interface UnsubmitProps {
  announcementId: string;
  submissionId: string;
}

export const Unsubmit: React.FC<UnsubmitProps> = ({
  announcementId,
  submissionId,
}) => {
  const { mutate: unsubmit, isLoading } = useUnsubmitSubmission();

  return (
    <Button
      className="h-8 text-xs w-full"
      variant="outline"
      disabled={isLoading}
      onClick={() => unsubmit({ announcementId, submissionId })}
    >
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Unsubmit"}
    </Button>
  );
};
