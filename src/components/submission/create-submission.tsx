import { Loader2 } from "lucide-react";

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
  const { mutate: createSubmission, isLoading } = useCreateSubmission();

  const handleCreateSubmission = () => {
    createSubmission({
      assignmentId,
    });
  };

  return (
    <Button
      disabled={disabled || isLoading}
      className="h-8 text-xs w-full"
      onClick={handleCreateSubmission}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
      ) : (
        " Submit Assignment"
      )}
    </Button>
  );
};
