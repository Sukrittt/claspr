import { Loader } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMoveNote } from "@/hooks/note";
import { Button } from "@/components/ui/button";
import { ExtendedFolder, MinifiedNote } from "@/types";

interface MoveNoteFormProps {
  note: MinifiedNote;
  folders: ExtendedFolder[];
  closeModal: () => void;
}

export const MoveNoteForm: React.FC<MoveNoteFormProps> = ({
  note,
  closeModal,
  folders,
}) => {
  const oldFolderId = useMemo(
    () => folders.find((folder) => folder.id === note.folderId),
    [folders, note.folderId]
  )?.id!; //Note will be there in a folder.

  const [selectedFolderId, setSelectedFolderId] = useState(oldFolderId);

  const { mutate: moveNote, isLoading } = useMoveNote({
    closeModal,
    oldFolderId,
  });

  return (
    <div className="space-y-4">
      <Select
        disabled={isLoading}
        value={selectedFolderId}
        onValueChange={(val) => setSelectedFolderId(val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {folders.map((tab) => (
            <SelectItem key={tab.id} value={tab.id}>
              {tab.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() =>
          moveNote({ folderId: selectedFolderId, noteId: note.id })
        }
      >
        {isLoading ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};