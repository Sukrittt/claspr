import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCreateMedia } from "@/hooks/media";
import { uploadFiles } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

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
      const [res] = await uploadFiles("imageUploader", {
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

  return (
    <div className="space-y-4">
      <Input
        disabled={isLoading || isCreatingMedia}
        className="cursor-pointer hover:bg-neutral-100 transition"
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png, .gif, .pdf, .mp4, .mp3, .wav, .doc, .docx"
        multiple
        type="file"
      />
      <Button
        className="w-full"
        disabled={isLoading || isCreatingMedia}
        onClick={onSubmit}
      >
        {isLoading || isCreatingMedia ? (
          <Loader className="h-4 w-4 animate-spin mr-2" />
        ) : (
          "Add Document"
        )}
        <span className="sr-only">Add Document</span>
      </Button>
    </div>
  );
};
