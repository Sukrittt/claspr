import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

import { ExtendedFolder } from "@/types";
import { NoteDropdown } from "./note-dropdown";
import { cn, getShortenedText } from "@/lib/utils";

interface NoteListsProps {
  activeNoteId: string;
  folders: ExtendedFolder[];
  activeFolder: ExtendedFolder | undefined;
  setActiveFolderId?: (folderId: string) => void;
}

export const NoteLists: React.FC<NoteListsProps> = ({
  activeFolder,
  activeNoteId,
  folders,
  setActiveFolderId,
}) => {
  const allNotes = {
    notes: folders.map((folder) => folder.notes).flat(),
  };

  return (
    <div className="flex flex-col gap-y-2">
      {(activeFolder ?? allNotes).notes.length === 0 ? (
        <p className="pt-2 text-[13px] text-muted-foreground text-center">
          No notes in this folder
        </p>
      ) : (
        (activeFolder ?? allNotes).notes.map((note) => (
          <Link
            key={note.id}
            href={`/n/${note.id}`}
            className={cn(
              "flex items-center justify-between rounded-md py-1 px-2 group hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition",
              {
                "bg-neutral-200 dark:bg-neutral-800": note.id === activeNoteId,
              }
            )}
          >
            <div className="flex items-center gap-x-2">
              {note.emojiUrl ? (
                <div className="p-1.5">
                  <div className="h-4 w-4 relative">
                    <Image
                      src={note.emojiUrl}
                      className="object-contain"
                      alt={note.title}
                      fill
                    />
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-1.5 text-gray-800 dark:text-foreground">
                  <FileText className="h-3.5 w-3.5" />
                </div>
              )}

              <p className="text-sm text-neutral-800 dark:text-foreground tracking-tight">
                {getShortenedText(note.title, 30)}
              </p>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition"
            >
              <NoteDropdown
                note={note}
                disabled={note.id === activeNoteId}
                setActiveFolderId={(folderId: string) =>
                  setActiveFolderId?.(folderId)
                }
                folders={folders}
              />
            </div>
          </Link>
        ))
      )}
    </div>
  );
};
