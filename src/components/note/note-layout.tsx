import { ExtendedNote } from "@/types";
import { NoteEditor } from "./note-editor";
import { NoteSidebar } from "./note-sidebar";

interface NoteLayoutProps {
  note: ExtendedNote;
}

export const NoteLayout: React.FC<NoteLayoutProps> = ({ note }) => {
  return (
    <div className="flex h-screen">
      <NoteSidebar note={note} />
      <div className="flex-1">
        <NoteEditor note={note} />
      </div>
    </div>
  );
};
