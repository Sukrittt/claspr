import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateSubmission } from "@/hooks/submission";

interface CreateSubmissionProps {
  announcementId: string;
  disabled: boolean;
}

export const CreateSubmission: React.FC<CreateSubmissionProps> = ({
  disabled,
  announcementId,
}) => {
  const { mutate: createSubmission, isLoading } = useCreateSubmission();

  const handleCreateSubmission = () => {
    createSubmission({
      announcementId,
    });
  };

  return (
    <Button
      disabled={disabled || isLoading}
      className="h-8 text-xs w-full"
      onClick={handleCreateSubmission}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        " Submit Assignment"
      )}
    </Button>
  );
};
