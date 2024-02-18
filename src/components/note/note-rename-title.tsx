import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

import { ExtendedNote } from "@/types";
import { useEditNote } from "@/hooks/note";
import { useDebounce } from "@/hooks/use-debounce";

export const NoteRenameTitle = ({ note }: { note: ExtendedNote }) => {
  const [title, setTitle] = useState(note.title);
  const debouncedTitle = useDebounce(title, 500);

  const { mutate: renameTitle } = useEditNote({
    folderId: note.folderId,
  });

  useEffect(() => {
    if (title === note.title) return;

    const formattedTitle =
      debouncedTitle.length === 0 ? "Untitled Note" : debouncedTitle.trim();
    ("");

    setTitle(formattedTitle);

    renameTitle({ title: formattedTitle, noteId: note.id });
  }, [debouncedTitle]);

  return (
    <ReactTextareaAutosize
      placeholder="Untitled Note"
      className="text-4xl font-semibold text-neutral-800 tracking-tight bg-transparent focus:outline-none w-full resize-none h-[46px]"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};
