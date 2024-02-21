import Image from "next/image";
import { useAtom } from "jotai";
import { format } from "date-fns";
import { FileText } from "lucide-react";

import { FormattedNote } from "@/types/note";
import { useUpdateViewCount } from "@/hooks/note";
import { activeNoteIdAtom, classFolderAtom } from "@/atoms";
import { NoteDropdown } from "@/components/note/note-dropdown";

interface MaterialCardProps {
  note: FormattedNote;
  classroomId: string;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  note,
  classroomId,
}) => {
  const [folders] = useAtom(classFolderAtom);
  const [, setActiveNoteId] = useAtom(activeNoteIdAtom);

  const { mutate: updateViews } = useUpdateViewCount();

  return (
    <div className="border-b px-3 py-4 flex items-center justify-between group">
      <div className="flex items-center gap-x-4">
        <div className="bg-neutral-200 rounded-md h-10 w-10 grid place-items-center">
          {note.emojiUrl ? (
            <div className="h-8 w-8 relative">
              <Image
                src={note.emojiUrl}
                className="object-contain"
                alt={note.title}
                fill
              />
            </div>
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>

        <div className="space-y-0.5">
          <h6
            onClick={() => {
              updateViews({ noteId: note.id });
              setActiveNoteId(note.id);
            }}
            className="font-medium tracking-tight text-base hover:underline underline-offset-4 hover:text-neutral-800 transition cursor-pointer w-fit"
          >
            {note.title}
          </h6>
          <div className="flex items-center gap-x-1 text-muted-foreground tracking-tight text-[13px]">
            <p>
              <span className="underline underline-offset-4">
                {note.creator.name}
              </span>{" "}
              created this on {format(note.createdAt, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition">
        <NoteDropdown
          note={note}
          folders={folders}
          disableLinkClassroom
          classroomId={classroomId}
        />
      </div>
    </div>
  );
};
