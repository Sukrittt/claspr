import { useAtom } from "jotai";
import { Session } from "next-auth";
import { FileX2 } from "lucide-react";

import { MaterialContent } from "./material-content";
import { Separator } from "@/components/ui/separator";
import { EditorOutput } from "@/components/editor/EditorOutput";
import { NoteRenameTitle } from "@/components/note/note-rename-title";
import {
  activeClassFolderIdAtom,
  activeNoteIdAtom,
  classFolderAtom,
} from "@/atoms";
import { useQueryChange } from "@/hooks/use-query-change";

interface MaterialDetailsProps {
  noteId: string;
  session: Session;
  classroomId: string;
}

export const MaterialDetails: React.FC<MaterialDetailsProps> = ({
  noteId,
  session,
  classroomId,
}) => {
  const [folders] = useAtom(classFolderAtom);
  const [activeFolderId] = useAtom(activeClassFolderIdAtom);
  const [, setActiveNoteId] = useAtom(activeNoteIdAtom);

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);
  const note = activeFolder?.notes.find((note) => note.id === noteId);

  const handleQueryChange = useQueryChange();

  if (!note) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-y-4">
        <FileX2 className="h-10 w-10 text-neutral-800" />
        <div className="space-y-1 text-sm text-muted-foreground flex flex-col items-center">
          <p>We couldn&rsquo;t find the note you&rsquo;re looking for.</p>
          <p
            className="font-semibold hover:underline underline-offset-4 cursor-pointer w-fit"
            onClick={() => {
              const initialUrl = `/c/${classroomId}`;
              handleQueryChange(initialUrl, { note: null });

              setActiveNoteId(null);
            }}
          >
            Go back
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <NoteRenameTitle
          folderId={note.folderId}
          noteId={note.id}
          classroomId={classroomId}
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
