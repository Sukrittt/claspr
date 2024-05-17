"use client";
import { useMemo, useState } from "react";
import { MonitorX, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedNote } from "@/types";
import { NoteLists } from "./note-lists";
import { useFolders } from "@/hooks/folder";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateNoteDialog } from "./dialog/create-note-dialog";
import { FolderDropdown } from "@/components/folder/folder-dropdown";
import { NoteSidebarSkeleton } from "@/components/skeletons/note-sidebar-skeleton";

export const NoteSidebarSheet = ({ note }: { note: ExtendedNote }) => {
  const { data: folders, isLoading } = useFolders();

  const [activeFolderId, setActiveFolderId] = useState(note.folder.id);

  const activeFolder = useMemo(
    () => folders?.find((folder) => folder.id === activeFolderId),
    [activeFolderId, folders]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="xl:hidden absolute top-[15px] right-4 text-sm cursor-pointer dark:hover:text-neutral-400 hover:text-neutral-700 transition">
          Manage
        </span>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-y-4">
        <SheetHeader className="space-y-1">
          <SheetTitle>{note.title}</SheetTitle>
          <SheetDescription>
            Manage your notes and folders here.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1">
          {isLoading ? (
            <NoteSidebarSkeleton />
          ) : !folders || folders.length === 0 ? (
            <div className="pt-20 flex flex-col items-center justify-center gap-y-2">
              <MonitorX className="h-10 w-10 text-neutral-800" />
              <div className="space-y-1 text-center">
                <p className="text-sm text-muted-foreground">
                  You shouldn&rsquo;t be seeing this.
                </p>
                <p className="text-sm text-muted-foreground">
                  We are working on fixing this issue.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center gap-x-2">
                  <Select
                    value={activeFolderId}
                    onValueChange={(val) => setActiveFolderId(val)}
                  >
                    <SelectTrigger className="w-full text-[13px]">
                      <SelectValue placeholder="Select Folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {[{ id: "ALL_NOTES", name: "All Notes" }, ...folders].map(
                        (folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {activeFolder && (
                    <FolderDropdown
                      folder={activeFolder}
                      isNotePage
                      setActiveFolderId={(folderId: string) =>
                        setActiveFolderId(folderId)
                      }
                    />
                  )}
                </div>

                <ScrollArea className="h-[60vh]">
                  <NoteLists
                    activeFolder={activeFolder}
                    activeNoteId={note.id}
                    folders={folders}
                    setActiveFolderId={setActiveFolderId}
                  />
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <CreateNoteDialog folderId={activeFolderId} noteType="PERSONAL">
          <Button type="button" className="mt-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </CreateNoteDialog>
      </SheetContent>
    </Sheet>
  );
};
