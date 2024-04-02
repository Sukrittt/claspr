"use client";
import { useAtom } from "jotai";
import { UserType } from "@prisma/client";
import { FolderCheck, FolderX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { MaterialCard } from "./material-card";
import { ContainerVariants } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaterialSkeleton } from "@/components/skeletons/material-skeleton";
import { CreateNoteDialog } from "@/components/note/dialog/create-note-dialog";
import {
  activeClassFolderIdAtom,
  classFolderAtom,
  globalLoaderAtom,
} from "@/atoms";
import { useMounted } from "@/hooks/use-mounted";
import { MaterialsGraphDialog } from "./materials-graph-dialog";

interface MaterialsProps {
  classroomId: string;
  userRole: UserType;
}

export const Materials: React.FC<MaterialsProps> = ({
  classroomId,
  userRole,
}) => {
  const [folders] = useAtom(classFolderAtom);
  const [isLoadingFolders] = useAtom(globalLoaderAtom);
  const [activeFolderId] = useAtom(activeClassFolderIdAtom);

  const mounted = useMounted();

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);

  if (isLoadingFolders || !mounted) {
    return <MaterialSkeleton />;
  }

  if (!activeFolder) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-y-2">
        <FolderCheck className="h-10 w-10 text-neutral-800 dark:text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Select or create a folder
        </p>
      </div>
    );
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

            {userRole === "TEACHER" && (
              <CreateNoteDialog
                folderId={activeFolder.id}
                noteType="CLASSROOM"
                classroomId={classroomId}
              />
            )}
          </div>
        </div>

        <div>
          <Separator />

          {activeFolder.notes.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-y-2">
              <FolderX className="h-10 w-10 text-neutral-800 dark:text-muted-foreground" />
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
