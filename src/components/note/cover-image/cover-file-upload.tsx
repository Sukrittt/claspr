import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { uploadFiles } from "@/lib/uploadthing";
import { ContainerVariants } from "@/lib/motion";
import { useUpdateNoteCover } from "@/hooks/note";

interface CoverFileUploadProps {
  noteId: string;
  closePopover: () => void;
}

export const CoverFileUpload: React.FC<CoverFileUploadProps> = ({
  closePopover,
  noteId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { mutate: updateCover } = useUpdateNoteCover({ closePopover });

  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  async function uploadByFile(file: File) {
    // upload to uploadthing
    const [res] = await uploadFiles("imageUpLoader", {
      files: [file],
    });

    return {
      url: res.url,
    };
  }

  async function handleUpdateCover() {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const { url: coverImage } = await uploadByFile(file);
    setIsUploading(false);

    updateCover({
      coverImage,
      noteId,
    });
  }

  useEffect(() => {
    if (!file) return;
    handleUpdateCover();
  }, [file]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 pt-1"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div
          onClick={handleFileClick}
          className={cn(
            "py-1 flex items-center justify-center font-medium text-sm tracking-tight w-full border rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
            {
              "opacity-50": isUploading,
            }
          )}
        >
          {isUploading ? (
            <Loader2 className="h-3 w-3 animate-spin my-1" />
          ) : (
            "Upload file"
          )}
        </div>
        <Input
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept="image/*"
          type="file"
        />

        <p className="text-xs text-muted-foreground text-center">
          Images wider than 1500 pixels work best.
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
