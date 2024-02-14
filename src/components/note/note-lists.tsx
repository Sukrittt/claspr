import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

import { ExtendedFolder } from "@/types";
import { NoteDropdown } from "./note-dropdown";
import { cn, getShortenedText } from "@/lib/utils";

interface NoteListsProps {
  activeFolder: ExtendedFolder;
  activeNoteId: string;
}

export const NoteLists: React.FC<NoteListsProps> = ({
  activeFolder,
  activeNoteId,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      {activeFolder.notes.map((note) => (
        <Link
          key={note.id}
          href={`/n/${note.id}`}
          className={cn(
            "flex items-center justify-between rounded-md py-1 px-2 group hover:bg-neutral-200 transition",
            {
              "bg-neutral-200": note.id === activeNoteId,
            }
          )}
        >
          <div className="flex items-center gap-x-2">
            {note.emojiUrl ? (
              <div className="h-4 w-4 relative">
                <Image
                  src={note.emojiUrl}
                  className="object-contain"
                  alt={note.title}
                  fill
                />
              </div>
            ) : (
              <div className="border rounded-md p-1.5 text-gray-800">
                <FileText className="h-3.5 w-3.5" />
              </div>
            )}

            <p className="text-sm text-neutral-800 tracking-tight">
              {getShortenedText(note.title, 30)}
            </p>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <NoteDropdown note={note} disabled={note.id === activeNoteId} />
          </div>
        </Link>
      ))}
    </div>
  );
};
