import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useCreateMedia } from "@/hooks/media";
import { uploadFiles } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { acceptFileExtensions } from "@/config/utils";

interface SubmitDocFormProps {
  closeModal: () => void;
  assignmentId: string;
}

export const SubmitDocForm: React.FC<SubmitDocFormProps> = ({
  closeModal,
  assignmentId,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const filesArray = Array.from(files);

    setFiles(filesArray);
  };

  const { mutate: createMedia, isLoading: isCreatingMedia } = useCreateMedia({
    closeModal,
  });

  async function uploadByFile(files: File[]) {
    const fileData = files.map(async (file) => {
      // upload to uploadthing
      const [res] = await uploadFiles("imageUpLoader", {
        files: [file],
      });

      return {
        url: res.url,
        label: file.name,
      };
    });

    return Promise.all(fileData);
  }

  async function onSubmit() {
    if (files.length === 0) {
      toast.error("Please upload a file.");
      return;
    }

    try {
      toast.loading("Uploading your file...", { duration: 4000 });
      setIsLoading(true);

      const fileObjs = await uploadByFile(files);

      createMedia({
        media: fileObjs,
        assignmentId,
        mediaType: "DOCUMENT",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFiles([]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (files.length === 0) return;

    onSubmit();
  }, [files]);

  return (
    <div className="space-y-4">
      <div
        onClick={handleFileClick}
        className={cn(
          "py-1 flex items-center justify-center font-medium text-sm tracking-tight w-full border rounded-md cursor-pointer hover:bg-neutral-100 transition",
          {
            "opacity-50": isLoading || isCreatingMedia,
          }
        )}
      >
        {isLoading || isCreatingMedia ? (
          <Loader2 className="h-3 w-3 animate-spin my-1" />
        ) : (
          "Upload file"
        )}
      </div>
      <Input
        disabled={isLoading || isCreatingMedia}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={acceptFileExtensions}
        multiple
        type="file"
      />
    </div>
  );
};
