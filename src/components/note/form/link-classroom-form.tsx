import { useState } from "react";
import { Loader2, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { MinifiedNote } from "@/types";
import { useEditNote } from "@/hooks/note";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

type UserClassroom = {
  classroomId: string;
  title: string;
};

interface LinkClassroomFormProps {
  closeModal: () => void;
  note: MinifiedNote;
  userClassrooms: UserClassroom[];
}

export const LinkClassroomForm: React.FC<LinkClassroomFormProps> = ({
  closeModal,
  note,
  userClassrooms,
}) => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    note.classroomId
  );

  const { mutate: linkClassroom, isLoading } = useEditNote({
    folderId: note.folderId,
    onComplete: closeModal,
  });

  function handleLinkClassroom() {
    linkClassroom({
      noteId: note.id,
      classroomId: selectedClassroomId,
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-2 justify-between">
        <Select
          disabled={isLoading}
          value={selectedClassroomId ?? undefined}
          onValueChange={(val) => setSelectedClassroomId(val)}
        >
          <SelectTrigger className="w-full text-[13px]">
            <SelectValue placeholder="Select a classroom" />
          </SelectTrigger>
          <SelectContent>
            {userClassrooms.map((classroom) => (
              <SelectItem
                key={classroom.classroomId}
                value={classroom.classroomId}
              >
                {classroom.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CustomTooltip text="Remove link">
          <div
            className={cn(
              "border rounded-md p-2 bg-neutral-100 dark:bg-neutral-800 transition cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800/60 dark:text-foreground",
              {
                "opacity-50": isLoading || !!!selectedClassroomId,
              }
            )}
            onClick={() => setSelectedClassroomId(null)}
          >
            <Trash className="h-3 w-3" />
          </div>
        </CustomTooltip>
      </div>

      <Button
        className="my-1 w-full h-7"
        onClick={handleLinkClassroom}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
