"use client";
import Image from "next/image";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/trpc/client";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface EmojiPopoverProps {
  emojiUrl: string | null;
  sectionId: string;
}

export const EmojiPopover: React.FC<EmojiPopoverProps> = ({
  emojiUrl,
  sectionId,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState({
    name: "",
    url: emojiUrl,
  });

  const { mutate: updateEmoji } = trpc.section.updateSection.useMutation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="p-1 rounded-md hover:bg-neutral-300 hover:text-gray-700 transition block">
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
              <Bookmark className="w-4 h-4" />
            </CustomTooltip>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-transparent shadow-none border-none pt-0">
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(e) => {
            setSelectedEmoji({ name: e.names[0], url: e.imageUrl });
            updateEmoji({ sectionId, emojiUrl: e.imageUrl });
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
