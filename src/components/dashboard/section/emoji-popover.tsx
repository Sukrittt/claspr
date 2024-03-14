"use client";
import Image from "next/image";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { SectionType } from "@prisma/client";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/trpc/client";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { createdClassSections, joinedClassSections } from "@/atoms";

interface EmojiPopoverProps {
  emojiUrl: string | null;
  sectionId: string;
  sectionType: SectionType;
}

export const EmojiPopover: React.FC<EmojiPopoverProps> = ({
  emojiUrl,
  sectionId,
  sectionType,
}) => {
  const [, setCreatedClassSections] = useAtom(createdClassSections);
  const [, setJoinedClassSections] = useAtom(joinedClassSections);

  const [selectedEmoji, setSelectedEmoji] = useState({
    name: "",
    url: emojiUrl,
  });

  useEffect(() => {
    if (emojiUrl === selectedEmoji.url) return;

    setSelectedEmoji({
      name: "",
      url: emojiUrl,
    });
  }, [emojiUrl]);

  const handleOptimisticUpdate = (emojiUrl: string) => {
    if (sectionType === "CREATION") {
      setCreatedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);

        if (index !== -1) {
          const updatedSections = [...prev];

          updatedSections[index] = {
            ...updatedSections[index],
            emojiUrl,
          };

          return updatedSections;
        }

        return prev;
      });
    } else {
      setJoinedClassSections((prev) => {
        const index = prev.findIndex((section) => section.id === sectionId);

        if (index !== -1) {
          const updatedSections = [...prev];

          updatedSections[index] = {
            ...updatedSections[index],
            emojiUrl,
          };

          return updatedSections;
        }

        return prev;
      });
    }
  };

  const { mutate: updateEmoji } = trpc.section.updateSection.useMutation({
    onMutate: ({ emojiUrl }) => {
      handleOptimisticUpdate(emojiUrl ?? "");
    },
  });

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
      <PopoverContent className="w-full bg-transparent border-0">
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
