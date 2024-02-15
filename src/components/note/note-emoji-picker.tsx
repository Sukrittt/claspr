"use client";
import Image from "next/image";
import { useState } from "react";
import { Smile } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditNote } from "@/hooks/note";

interface EmojiPickerToolProps {
  emojiUrl: string | null;
  folderId: string;
  noteId: string;
}

export const NoteEmojiPicker: React.FC<EmojiPickerToolProps> = ({
  emojiUrl,
  folderId,
  noteId,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState({
    name: "",
    url: emojiUrl ?? "",
  });

  const { mutate: updateEmoji } = useEditNote({ folderId });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="py-1 px-2 cursor-pointer block w-fit">
          {selectedEmoji.url ? (
            <div className="absolute left-20 -top-10">
              <div className="border p-2 rounded-xl bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
                <div className="h-8 w-8 relative">
                  <Image
                    src={selectedEmoji.url}
                    className="object-contain"
                    alt={selectedEmoji.name}
                    fill
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-2 text-[13px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition rounded-md hover:bg-neutral-200 hover:text-gray-700 py-0.5 px-2">
              <Smile className="h-3.5 w-3.5" />
              <span>Add icon</span>
            </div>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-transparent shadow-none border-none pt-0">
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(e) => {
            setSelectedEmoji({ name: e.names[0], url: e.imageUrl });
            updateEmoji({
              noteId,
              emojiUrl: e.imageUrl,
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
