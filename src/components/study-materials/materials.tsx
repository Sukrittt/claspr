import { useAtom } from "jotai";
import { FolderX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { MaterialCard } from "./material-card";
import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaterialSkeleton } from "@/components/skeletons/material-skeleton";
import { CreateNoteDialog } from "@/components/note/mutations/create-note-dialog";
import {
  activeClassFolderIdAtom,
  classFolderAtom,
  globalLoaderAtom,
} from "@/atoms";
import { MaterialsGraphDialog } from "./materials-graph-dialog";

export const Materials = ({ classroomId }: { classroomId: string }) => {
  const [folders] = useAtom(classFolderAtom);
  const [isLoadingFolders] = useAtom(globalLoaderAtom);
  const [activeFolderId] = useAtom(activeClassFolderIdAtom);

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);

  if (isLoadingFolders) {
    return <MaterialSkeleton />;
  }

  //   TODO
  if (!activeFolder) {
    return <p>Select a folder to view the notes</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-2 h-full"
      >
        <div className="flex justify-between items-center">
          <p className="tracking-tight text-sm font-medium">
            {activeFolder?.name}
          </p>
          <div className="flex items-center gap-x-2">
            <MaterialsGraphDialog
              notes={activeFolder.notes}
              classroomId={classroomId}
            />

            <CreateNoteDialog
              folderId={activeFolder.id}
              noteType="CLASSROOM"
              classroomId={classroomId}
            />
          </div>
        </div>

        <div>
          <Separator />
          {activeFolder.notes.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-y-2">
              <FolderX className="h-10 w-10 text-neutral-800" />
              <p className="text-sm text-muted-foreground">
                No material created yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[68vh]">
              {activeFolder.notes.map((note) => (
                <MaterialCard
                  key={note.id}
                  note={note}
                  classroomId={classroomId}
                />
              ))}
            </ScrollArea>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
