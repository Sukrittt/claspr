import { useEffect } from "react";
import { useAtom } from "jotai";
import { Folder } from "lucide-react";
import { useFolders } from "@/hooks/folder";
import { AnimatePresence, motion } from "framer-motion";

import { ExtendedFolder } from "@/types";
import { ContainerVariants } from "@/lib/motion";
import { cn, getShortenedText } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderDropdown } from "@/components/folder/folder-dropdown";
import {
  activeClassFolderIdAtom,
  activeNoteIdAtom,
  classFolderAtom,
  globalLoaderAtom,
} from "@/atoms";
import { MaterialTabsSkeleton } from "@/components/skeletons/material-skeleton";
import { CreateFolderDialog } from "@/components/folder/mutations/create-folder-dialog";

interface MaterialsProps {
  classroomId: string;
}

export const MaterialTabs: React.FC<MaterialsProps> = ({ classroomId }) => {
  const [folders, setFolders] = useAtom(classFolderAtom);
  const [, setIsLoadingFolders] = useAtom(globalLoaderAtom);
  const { data: serverFolders, isLoading } = useFolders(classroomId);

  useEffect(() => {
    if (serverFolders) {
      setFolders(serverFolders);
    }
  }, [serverFolders]);

  useEffect(() => {
    setIsLoadingFolders(isLoading);
  }, [isLoading]);

  const getFoldersSortedByDate = (folders: ExtendedFolder[]) => {
    return folders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-4 h-full"
      >
        <div className="flex items-center justify-between">
          <h3 className="tracking-tight font-medium text-[13px]">Folders</h3>
          <CreateFolderDialog classroomId={classroomId} />
        </div>
        <ScrollArea className="h-[68vh]">
          <div className="space-y-2">
            {isLoading ? (
              <MaterialTabsSkeleton />
            ) : !folders || folders.length === 0 ? (
              <p>No folders found.</p>
            ) : (
              getFoldersSortedByDate(folders).map((folder, index) => (
                <MaterialTab
                  key={folder.id}
                  folder={folder}
                  isFirstFolder={index === 0}
                  classroomId={classroomId}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};

interface MaterialTabProps {
  folder: ExtendedFolder;
  isFirstFolder: boolean;
  classroomId: string;
}

const MaterialTab: React.FC<MaterialTabProps> = ({
  folder,
  isFirstFolder,
  classroomId,
}) => {
  const [activeFolderId, setActiveFolderId] = useAtom(activeClassFolderIdAtom);
  const [, setActiveNoteId] = useAtom(activeNoteIdAtom);

  useEffect(() => {
    if (isFirstFolder) {
      setActiveFolderId(folder.id);
      setActiveNoteId(null);
    }
  }, [isFirstFolder]);

  return (
    <div
      className={cn(
        "py-1 px-2.5 flex items-center justify-between hover:bg-neutral-100 rounded-md text-[13px] cursor-pointer group",
        {
          "bg-neutral-100 font-medium": activeFolderId === folder.id,
        }
      )}
      onClick={() => {
        setActiveFolderId(folder.id);
        setActiveNoteId(null);
      }}
    >
      <div className="flex items-center gap-x-2">
        <div className="border rounded-md p-1.5">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <p>{getShortenedText(folder.name, 25)}</p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition">
        <FolderDropdown folder={folder} classroomId={classroomId} />
      </div>
    </div>
  );
};
