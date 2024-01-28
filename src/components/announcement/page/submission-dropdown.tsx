import { useState } from "react";
import { File, Link } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmitLinkDialog } from "./submit-link-dialog";
import { SubmitDocumentDialog } from "./submit-document-dialog";

interface SubmissionDropdownProps {
  children: React.ReactNode;
  announcementId: string;
}

export const SubmissionDropdown: React.FC<SubmissionDropdownProps> = ({
  children,
  announcementId,
}) => {
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsLinkOpen(true)}
          >
            <Link className="h-3.5 w-3.5 mr-2" />
            Link
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 text-[13px]"
            onClick={() => setIsDocumentOpen(true)}
          >
            <File className="h-3.5 w-3.5 mr-2" />
            Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isLinkOpen && (
        <SubmitLinkDialog
          announcementId={announcementId}
          isOpen={isLinkOpen}
          setIsDialogOpen={setIsLinkOpen}
        />
      )}
      {isDocumentOpen && (
        <SubmitDocumentDialog
          announcementId={announcementId}
          isOpen={isDocumentOpen}
          setIsDialogOpen={setIsDocumentOpen}
        />
      )}
    </>
  );
};
