"use client";
import Image from "next/image";
import { useState } from "react";
import { Smile, Trash } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditNote } from "@/hooks/note";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface EmojiPickerToolProps {
  emojiUrl: string | null;
  folderId: string;
  noteId: string;
  setHasEmoji: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NoteEmojiPicker: React.FC<EmojiPickerToolProps> = ({
  emojiUrl,
  folderId,
  noteId,
  setHasEmoji,
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
            <div className="absolute left-7 -top-10">
              <div className="border p-2 rounded-xl bg-white bg-opacity-20 backdrop-blur-lg hover:bg-neutral-200/50 transition drop-shadow-lg">
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
            <div className="flex items-center gap-x-2 text-[13px] text-muted-foreground font-medium transition rounded-md hover:bg-neutral-200 hover:text-gray-700 dark:text-gray-300 py-1 px-2">
              <Smile className="h-3.5 w-3.5" />
              <span>Add icon</span>
            </div>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-transparent shadow-none border-none pt-0 relative">
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(e) => {
            setHasEmoji(true);

            setSelectedEmoji({ name: e.names[0], url: e.imageUrl });
            updateEmoji({
              noteId,
              emojiUrl: e.imageUrl,
            });
          }}
        />

        {selectedEmoji.url && (
          <CustomTooltip text="Remove icon">
            <div
              onClick={() => {
                setHasEmoji(false);

                setSelectedEmoji({
                  name: "",
                  url: "",
                });
                updateEmoji({ noteId, emojiUrl: null });
              }}
              className="absolute bottom-[38px] right-10 p-1 border rounded-md transition cursor-pointer z-50"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </div>
          </CustomTooltip>
        )}
      </PopoverContent>
    </Popover>
  );
};
