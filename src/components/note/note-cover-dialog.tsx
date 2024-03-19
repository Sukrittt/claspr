import { useState } from "react";
import { Image as Gallery, Trash } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUpdateNoteCover } from "@/hooks/note";
import { LinkInput } from "./cover-image/link-input";
import { ChooseGradient } from "./cover-image/choose-gradient";
import { CoverFileUpload } from "./cover-image/cover-file-upload";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { UnsplashImagePicker } from "./cover-image/unsplash-image-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NoteCoverImagePickerProps {
  noteId: string;
  hasCover: boolean;
  hasEmoji: boolean;
}

export const NoteCoverImagePicker: React.FC<NoteCoverImagePickerProps> = ({
  noteId,
  hasCover,
  hasEmoji,
}) => {
  const [open, setOpen] = useState(false);

  const closePopover = () => {
    setOpen(false);
  };

  const { mutate: updateCover } = useUpdateNoteCover({ closePopover });

  const handleRemoveCover = () => {
    updateCover({
      noteId,
    });
  };

  return (
    <Popover open={open} onOpenChange={(val) => setOpen(val)}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "cursor-pointer flex items-center gap-x-2 text-[13px] font-medium transition rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800/70 hover:text-gray-700 dark:hover:text-foreground py-1.5 px-2",
            {
              "bg-neutral-100 dark:bg-neutral-800 opacity-0 group-hover/child:opacity-100":
                hasEmoji,
            }
          )}
        >
          <Gallery className="h-3.5 w-3.5" />
          <span className="text-xs">
            {hasCover ? "Change cover" : "Add cover"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn("py-3.5 lg:w-[500px]", {
          "ml-20": !hasCover,
          "mr-5": hasCover,
        })}
      >
        <Tabs defaultValue="gradient">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            </TabsList>
            {hasCover && (
              <CustomTooltip text="Remove Cover">
                <Trash
                  onClick={handleRemoveCover}
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-neutral-700 cursor-pointer transition"
                />
              </CustomTooltip>
            )}
          </div>
          <TabsContent value="gradient">
            <ChooseGradient closePopover={closePopover} noteId={noteId} />
          </TabsContent>
          <TabsContent value="upload">
            <CoverFileUpload closePopover={closePopover} noteId={noteId} />
          </TabsContent>
          <TabsContent value="link">
            <LinkInput closePopover={closePopover} noteId={noteId} />
          </TabsContent>
          <TabsContent value="unsplash">
            <UnsplashImagePicker closePopover={closePopover} noteId={noteId} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
