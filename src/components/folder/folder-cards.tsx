"use client";
import Link from "next/link";
import Image from "next/image";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, File, FileText, Folder } from "lucide-react";

import { activeFolderIdAtom, folderAtom } from "@/atoms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtendedFolder } from "@/types";
import { getShortenedText } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { usePersonalFolders } from "@/hooks/folder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreateFolderDialog } from "./mutations/create-folder-dialog";
import { CreateNoteDialog } from "@/components/note/create-note-dialog";

export const FolderCards = () => {
  const [folders, setFolders] = useAtom(folderAtom);
  const [activeFolderId, setActiveFolderId] = useAtom(activeFolderIdAtom);

  const { data: serverFolders, isLoading } = usePersonalFolders();

  useEffect(() => {
    if (serverFolders) {
      setFolders(serverFolders);
    }
  }, [serverFolders]);

  return (
    <Card>
      <CardHeader className="border-b py-2.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base pt-1">Your Folders</CardTitle>

          <CreateFolderDialog />
        </div>

        <CardDescription className="text-[13px] flex gap-x-1 items-center">
          You can create folders to organize your notes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 px-0 text-sm">
        <ScrollArea className="h-[25vh] pr-0">
          {isLoading ? (
            <p>Loading...</p>
          ) : !folders || folders.length === 0 ? (
            <p>No folders</p>
          ) : activeFolderId ? (
            <FolderNotes
              activeFolderId={activeFolderId}
              handleGoBack={() => setActiveFolderId(null)}
              folders={folders}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex flex-col gap-y-2">
                  {folders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      setFolderActive={(folderId: string) =>
                        setActiveFolderId(folderId)
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface FolderCardProps {
  folder: ExtendedFolder;
  setFolderActive: (folderId: string) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, setFolderActive }) => {
  return (
    <div
      onClick={() => setFolderActive(folder.id)}
      className="flex items-center justify-between group pb-2 px-6 text-gray-800 text-sm border-b cursor-pointer"
    >
      <div className="flex items-center gap-x-3">
        <div className="border rounded-md p-1.5">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <p className="text-[13px] font-medium group-hover:underline underline-offset-4 cursor-pointer">
          {getShortenedText(folder.name, 15)}
        </p>
      </div>
      <CustomTooltip
        text={`${folder.notes.length} note${
          folder.notes.length === 1 ? "" : "s"
        } in this folder`}
      >
        <p className="text-[13px]">{folder.notes.length}</p>
      </CustomTooltip>
    </div>
  );
};

interface FolderNotesProps {
  activeFolderId: string;
  folders: ExtendedFolder[];
  handleGoBack: () => void;
}

const FolderNotes: React.FC<FolderNotesProps> = ({
  folders,
  handleGoBack,
  activeFolderId,
}) => {
  const activeFolder = useMemo(
    () => folders.find((folder) => folder.id === activeFolderId),
    [activeFolderId, folders]
  );

  if (!activeFolder) {
    handleGoBack();
    return;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 text-[13px]"
      >
        <div className="flex items-end justify-between px-6">
          <div
            onClick={handleGoBack}
            className="text-muted-foreground group font-medium flex items-center gap-x-1 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />

            <p className="group-hover:underline underline-offset-4">
              ../{activeFolder.name}
            </p>
          </div>
          <CreateNoteDialog folderId={activeFolder.id} noteType="PERSONAL" />
        </div>

        <div className="flex flex-col gap-y-2">
          {activeFolder.notes.length === 0 ? (
            <div className="pt-10 flex flex-col gap-y-2 items-center text-muted-foreground px-6">
              <File className="h-4 w-4" />
              <p>No notes in this folder.</p>
            </div>
          ) : (
            activeFolder.notes.map((note) => (
              <Link
                href={`/n/${note.id}`}
                key={note.id}
                className="flex items-center gap-x-2 border-b pb-2 px-6 group"
              >
                {note.emojiUrl ? (
                  <div className="h-4 w-4 relative">
                    <Image
                      src={note.emojiUrl}
                      className="object-contain"
                      alt={note.title}
                      fill
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-1.5 text-gray-800">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                )}
                <p className="text-[13px] group-hover:underline underline-offset-4">
                  {note.title}
                </p>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
