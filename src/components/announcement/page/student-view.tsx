import moment from "moment";

import { timeAgo } from "@/lib/utils";
import { ExtendedAnnouncement } from "@/types";
import { SubmissionCard } from "../../submission/submission-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/custom/user-avatar";
import { EditorOutput } from "@/components/editor/EditorOutput";

interface StudentViewProps {
  announcement: ExtendedAnnouncement;
}

export const StudentView: React.FC<StudentViewProps> = ({ announcement }) => {
  const getModifiedDueDate = () => {
    const parsedDueDate = moment(announcement.dueDate, "YYYY-MM-DD");

    const currentDate = moment();
    const daysDifference = parsedDueDate.diff(currentDate, "days");

    if (daysDifference === 1) {
      return "Due Tomorrow";
    } else if (daysDifference < 0) {
      return "Expired";
    } else {
      return `Due ${timeAgo(announcement.dueDate)}`;
    }
  };

  return (
    <div className="px-20 py-8 grid grid-cols-8 gap-8">
      <div className="col-span-5 xl:col-span-6 space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {announcement.title}
            </h2>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-x-1">
                <UserAvatar user={announcement.creator} className="h-5 w-5" />
                <span>{announcement.creator.name}</span>
                <span>•</span>
                <span>Updated {timeAgo(announcement.updatedAt)}</span>
              </div>

              <span className="font-semibold">{getModifiedDueDate()}</span>
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-[480px]">
            <EditorOutput content={announcement.description} />
          </ScrollArea>
        </div>
      </div>
      <div className="col-span-3 xl:col-span-2 w-full">
        <SubmissionCard announcementId={announcement.id} />
      </div>
    </div>
  );
};
