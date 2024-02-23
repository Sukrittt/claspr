import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

import { useEditNote } from "@/hooks/note";
import { useDebounce } from "@/hooks/use-debounce";

interface NoteRenameTitleProps {
  noteId: string;
  noteTitle: string;
  folderId: string;
  classroomId?: string;
  disabled?: boolean;
}

export const NoteRenameTitle: React.FC<NoteRenameTitleProps> = ({
  noteId,
  noteTitle,
  folderId,
  classroomId,
  disabled = false,
}) => {
  const [title, setTitle] = useState(noteTitle);
  const debouncedTitle = useDebounce(title, 500);

  const { mutate: renameTitle } = useEditNote({
    folderId,
    classroomId,
  });

  useEffect(() => {
    if (title === noteTitle || disabled) return;

    const formattedTitle =
      debouncedTitle.length === 0 ? "Untitled Note" : debouncedTitle.trim();
    ("");

    renameTitle({ title: formattedTitle, noteId });
  }, [debouncedTitle]);

  return disabled ? (
    <h4 className="text-4xl font-semibold text-neutral-800 tracking-tight">
      {title}
    </h4>
  ) : (
    <ReactTextareaAutosize
      placeholder="Untitled Note"
      className="text-4xl font-semibold text-neutral-800 tracking-tight bg-transparent focus:outline-none w-full resize-none h-[46px]"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};
