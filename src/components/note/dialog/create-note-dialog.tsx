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
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateNoteForm } from "@/components/note/form/create-note-form";

interface CreateNoteDialogProps {
  classroomId?: string;
  folderId: string;
  noteType: NoteType;
  children?: React.ReactNode;
}

export const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  classroomId,
  folderId,
  noteType,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <div>
            <CustomTooltip text="Create Note">
              <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 dark:text-gray-300 transition hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <Plus className="h-3.5 w-3.5" />
                <div className="sr-only">Create Note</div>
              </div>
            </CustomTooltip>
          </div>
        )}
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
