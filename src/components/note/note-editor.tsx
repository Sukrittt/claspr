"use client";
import Image from "next/image";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Smile } from "lucide-react";

import { ExtendedNote } from "@/types";
import { useUpdateNoteContent } from "@/hooks/note";
import { Editor } from "@/components/editor/Editor";
import { NoteEmojiPicker } from "./note-emoji-picker";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NoteEditor = ({ note }: { note: ExtendedNote }) => {
  const [content] = useAtom(contentAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const { mutate: updateContent } = useUpdateNoteContent();

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
      <div className="h-36 border-b bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="pl-12 relative">
        <NoteEmojiPicker
          emojiUrl={note.emojiUrl}
          folderId={note.folderId}
          noteId={note.id}
        />
      </div>

      <div className="p-4">
        <ScrollArea
          className="pr-0 h-[55vh]"
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
