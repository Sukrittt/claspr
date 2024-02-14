import { ExtendedNote } from "@/types";
import { NoteSidebar } from "./note-sidebar";

interface NoteLayoutProps {
  note: ExtendedNote;
}

export const NoteLayout: React.FC<NoteLayoutProps> = ({ note }) => {
  return (
    <div className="flex gap-x-4 h-screen">
      <NoteSidebar note={note} />
      <div className="flex-1 p-6">{note.title}</div>
    </div>
  );
};
