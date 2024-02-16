"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { ExtendedNote } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Editor } from "@/components/editor/Editor";
import { NoteEmojiPicker } from "./note-emoji-picker";
import { NoteRenameTitle } from "./note-rename-title";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteCoverImagePicker } from "./note-cover-dialog";
import { CoverDisplay } from "./cover-image/cover-display";
import { useNoteCover, useUpdateNoteContent } from "@/hooks/note";

export const NoteEditor = ({ note }: { note: ExtendedNote }) => {
  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useUpdateNoteContent();
  const { data: noteCover, isLoading } = useNoteCover(note.id);

  const handleUpdateContent = () => {
    updateContent({
      noteId: note.id,
      content,
    });
    setIsSubmitting(undefined);
  };

  useEffect(() => {
    if (isSubmitting !== undefined && !isSubmitting) {
      handleUpdateContent();
    }
  }, [isSubmitting]);

  return (
    <div className="space-y-4 group">
      {isLoading ? (
        <Skeleton className="h-44 w-full rounded-none" />
      ) : noteCover?.coverImage ? (
        <CoverDisplay
          coverImage={noteCover.coverImage}
          alt={`${note.title}'s cover image`}
        />
      ) : (
        <div
          className={cn(
            "h-44 border-b bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
            noteCover?.gradientClass
          )}
        />
      )}

      <div className="pl-12 relative flex items-center gap-x-2">
        <NoteEmojiPicker
          emojiUrl={note.emojiUrl}
          folderId={note.folderId}
          noteId={note.id}
        />

        {isLoading ? (
          note.emojiUrl && (
            <div className="absolute right-5">
              <Skeleton className="h-6 w-24" />
            </div>
          )
        ) : (
          <div
            className={cn({
              "absolute right-5": !!note.emojiUrl,
            })}
          >
            <NoteCoverImagePicker noteId={note.id} hasCover={!!noteCover} />
          </div>
        )}
      </div>

      <div className="pl-20 pt-1">
        <NoteRenameTitle note={note} />
      </div>

      <div className="p-4">
        <ScrollArea
          className="pr-0 pl-10 h-[45vh]"
          style={{
            position: "static", // For some reason, 'static' tailwind class does not work here
          }}
        >
          <Editor
            isNotePage
            note={note}
            title={note.title}
            content={note.content}
            getDebouncedContent
            placeholder="Start writing..."
          />
        </ScrollArea>
      </div>
    </div>
  );
};
