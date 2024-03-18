import { CheckCircle2 } from "lucide-react";

import { timeAgo } from "@/lib/utils";
import { MinifiedUser } from "@/types";

interface AnswerDetailsProps {
  answeredBy: MinifiedUser;
  text: string;
  answeredAt: Date;
}

export const AnswerDetails: React.FC<AnswerDetailsProps> = ({
  answeredAt,
  answeredBy,
  text,
}) => {
  return (
    <div className="p-4 bg-green-100 dark:bg-[#12261e]/80 space-y-4">
      <div className="flex items-center gap-x-2 text-xs">
        <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-600" />
        <p className="text-green-700">
          Answered by <span className="font-medium">{answeredBy.name}</span>
        </p>
        <p className="text-muted-foreground">{timeAgo(answeredAt)}</p>
      </div>
      <div className="text-[13px]">{text}</div>
    </div>
  );
};
