"use client";
import Link from "next/link";
import { useAtom } from "jotai";
import { MoveUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ExtendedNote } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Editor } from "@/components/editor/Editor";
import { NoteEmojiPicker } from "./note-emoji-picker";
import { NoteRenameTitle } from "./note-rename-title";
import { Separator } from "@/components/ui/separator";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteCoverImagePicker } from "./note-cover-dialog";
import { CoverDisplay } from "./cover-image/cover-display";
import { useNoteCover, useUpdateNoteContent } from "@/hooks/note";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

export const NoteEditor = ({ note }: { note: ExtendedNote }) => {
  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useUpdateNoteContent();
  const { data: noteCover, isLoading } = useNoteCover(note.id);

  const [hasEmoji, setHasEmoji] = useState(!!note.emojiUrl);

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
    <div className="space-y-4 group/parent">
      <div className="space-y-4 group/child relative">
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

        <div className="pl-0 lg:pl-12 flex items-center gap-x-2">
          <div className="relative">
            <NoteEmojiPicker
              emojiUrl={note.emojiUrl}
              folderId={note.folderId}
              noteId={note.id}
              setHasEmoji={setHasEmoji}
            />
          </div>

          {isLoading ? (
            hasEmoji && (
              <div className="absolute right-5">
                <Skeleton className="h-6 w-24" />
              </div>
            )
          ) : (
            <div
              className={cn({
                "absolute top-5 right-5": hasEmoji,
              })}
            >
              <NoteCoverImagePicker
                noteId={note.id}
                hasCover={!!noteCover?.coverImage}
                hasEmoji={hasEmoji}
              />
            </div>
          )}
        </div>
      </div>

      <div className="px-6 lg:px-20 pt-1 relative">
        <NoteRenameTitle
          noteId={note.id}
          noteTitle={note.title}
          folderId={note.folderId}
        />

        <div className="space-y-1">
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

        {note.classroomId && (
          <div className="absolute -top-5 right-5 border py-0.5 px-2.5 text-xs tracking-tight rounded-full cursor-pointer hover:bg-neutral-100 transition">
            <CustomTooltip text="Jump to classroom">
              <Link
                target="_blank"
                href={`/c/${note.classroomId}`}
                className="flex items-center gap-x-2"
              >
                <span>{note.classroom?.title}</span>
                <MoveUpRight className="h-3 w-3" />
              </Link>
            </CustomTooltip>
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        <ScrollArea
          className="pr-0 pl-0 lg:pl-10 h-[45vh]"
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
