"use client";
import Image from "next/image";
import { useState } from "react";
import { FileText } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface EmojiPickerToolProps {
  emojiUrl: string | undefined;
  setEmojiUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const EmojiPickerTool: React.FC<EmojiPickerToolProps> = ({
  emojiUrl,
  setEmojiUrl,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState({
    name: "",
    url: emojiUrl ?? "",
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="p-2 cursor-pointer rounded-md bg-neutral-200 hover:bg-neutral-300 hover:text-gray-700 transition block">
          {selectedEmoji.url ? (
            <div className="h-4 w-4 relative">
              <Image
                src={selectedEmoji.url}
                className="object-contain"
                alt={selectedEmoji.name}
                fill
              />
            </div>
          ) : (
            <CustomTooltip text="Pick Emoji">
              <FileText className="w-4 h-4" />
            </CustomTooltip>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-transparent shadow-none border-none pt-0">
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(e) => {
            setEmojiUrl(e.imageUrl);
            setSelectedEmoji({ name: e.names[0], url: e.imageUrl });
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
