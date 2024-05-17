import { ExtendedNote } from "@/types";
import { NoteEditor } from "./note-editor";
import { NoteSidebar } from "./note-sidebar";
import { NoteSidebarSheet } from "./note-sidebar-sheet";

interface NoteLayoutProps {
  note: ExtendedNote;
}

export const NoteLayout: React.FC<NoteLayoutProps> = ({ note }) => {
  return (
    <div className="flex h-[94vh]">
      <NoteSidebarSheet note={note} />

      <NoteSidebar note={note} />

      <div className="flex-1">
        <NoteEditor note={note} />
      </div>
    </div>
  );
};
