import { useState } from "react";
import { Media } from "@prisma/client";
import { MoreVertical, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMediaLinkDialog } from "./dialog/media-edit-dialog";
import { DeleteMediaDialog } from "./dialog/media-delete-dialog";

interface MediaDropdownProps {
  media: Media;
}

export const MediaDropdown: React.FC<MediaDropdownProps> = ({ media }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="h-4 w-4 text-gray-800 hover:text-gray-700 dark:text-gray-300 transition cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          {media.mediaType === "LINK" && (
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-300 text-[13px]"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 text-[13px]"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && media.mediaType === "LINK" && (
        <EditMediaLinkDialog
          media={media}
          isOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {isDeleteOpen && (
        <DeleteMediaDialog
          media={media}
          isOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      )}
    </>
  );
};
