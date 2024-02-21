import { useAtom } from "jotai";
import { Session } from "next-auth";

import { MaterialContent } from "./material-content";
import { Separator } from "@/components/ui/separator";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { activeClassFolderIdAtom, classFolderAtom } from "@/atoms";
import { NoteRenameTitle } from "../note/note-rename-title";

interface MaterialDetailsProps {
  noteId: string;
  session: Session;
}

export const MaterialDetails: React.FC<MaterialDetailsProps> = ({
  noteId,
  session,
}) => {
  const [folders] = useAtom(classFolderAtom);
  const [activeFolderId] = useAtom(activeClassFolderIdAtom);

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);
  const note = activeFolder?.notes.find((note) => note.id === noteId);

  // TODO
  if (!note) {
    return <p>No note found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <NoteRenameTitle
          folderId={note.folderId}
          noteId={note.id}
          noteTitle={note.title}
          disabled={note.creator.id !== session.user.id}
        />
        <div>
          {note.topics.length > 0 && (
            <div className="flex text-muted-foreground text-xs font-semibold tracking-tight items-center gap-x-2">
              {note.topics.map((topic, index) => (
                <div key={topic.id} className="flex items-center gap-x-2">
                  <p>{topic.name}</p>
                  {index !== note.topics.length - 1 && (
                    <Separator
                      className="h-4 bg-neutral-300"
                      orientation="vertical"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {note.creator.id !== session.user.id ? (
        <EditorOutput content={note.content} />
      ) : (
        <MaterialContent note={note} />
      )}
    </div>
  );
};
