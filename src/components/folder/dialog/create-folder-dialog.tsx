import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateFolderForm } from "@/components/folder/form/create-folder-form";

interface CreateFolderDialogProps {
  classroomId?: string;
  setActiveFolderId?: (folderId: string) => void;
  isOpen?: boolean;
  setIsCreateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isNotePage?: boolean;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  classroomId,
  setActiveFolderId,
  isOpen = false,
  setIsCreateOpen,
  isNotePage = false,
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setIsCreateOpen?.(val);
      }}
    >
      <DialogTrigger asChild>
        {isNotePage ? (
          <></>
        ) : (
          <div>
            <CustomTooltip text="Create Folder">
              <div className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200">
                <Plus className="h-3.5 w-3.5" />
                <div className="sr-only">Create folder</div>
              </div>
            </CustomTooltip>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a folder</DialogTitle>
          <DialogDescription>
            Create a folder to organize your notes
          </DialogDescription>
        </DialogHeader>

        <CreateFolderForm
          classroomId={classroomId}
          closeModal={() => {
            setIsCreateOpen?.(false);
            setOpen(false);
          }}
          setActiveFolderId={setActiveFolderId}
        />
      </DialogContent>
    </Dialog>
  );
};
