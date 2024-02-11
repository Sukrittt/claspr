import { User } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";

import { timeAgo } from "@/lib/utils";

interface AnswerDetailsProps {
  answeredBy: User;
  text: string;
  answeredAt: Date;
}

export const AnswerDetails: React.FC<AnswerDetailsProps> = ({
  answeredAt,
  answeredBy,
  text,
}) => {
  return (
    <div className="p-4 bg-green-100 space-y-4">
      <div className="flex items-center gap-x-2 text-xs">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <p className="text-green-700">
          Answered by <span className="font-medium">{answeredBy.name}</span>
        </p>
        <p className="text-muted-foreground">{timeAgo(answeredAt)}</p>
      </div>
      <div className="text-[13px]">{text}</div>
    </div>
  );
};
