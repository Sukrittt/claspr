import { useState } from "react";
import { Plus } from "lucide-react";
import { NoteType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateNoteForm } from "./create-note-form";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface CreateNoteDialogProps {
  classroomId?: string;
  folderId: string;
  noteType: NoteType;
}

export const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  classroomId,
  folderId,
  noteType,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <CustomTooltip text="Create Note">
            <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200">
              <Plus className="h-3.5 w-3.5" />
              <div className="sr-only">Create Note</div>
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a note</DialogTitle>
          <DialogDescription>Create a note in this folder</DialogDescription>
        </DialogHeader>

        <CreateNoteForm
          folderId={folderId}
          noteType={noteType}
          classroomId={classroomId}
          closeModal={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
