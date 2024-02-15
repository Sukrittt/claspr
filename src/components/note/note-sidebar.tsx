"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderIcon, PanelLeft, PanelLeftOpen, Plus } from "lucide-react";

import { ExtendedNote } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NoteLists } from "./note-lists";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { usePersonalFolders } from "@/hooks/folder";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { CreateNoteDialog } from "./mutations/create-note-dialog";
import { CreateFolderDialog } from "@/components/folder/mutations/create-folder-dialog";
import { FolderDropdown } from "../folder/folder-dropdown";

export const NoteSidebar = ({ note }: { note: ExtendedNote }) => {
  const { data: folders, isLoading, isFetching } = usePersonalFolders();
  const [sidebarState, setSidebarState] = useSidebarState();

  const [activeFolderId, setActiveFolderId] = useState(note.folder.id);

  const activeFolder = useMemo(
    () => folders?.find((folder) => folder.id === activeFolderId),
    [activeFolderId, folders]
  );

  return (
    <aside
      className={cn(
        "w-[350px] h-full border-r p-6 flex flex-col justify-between gap-y-8 transition-[width] duration-300",
        {
          "w-10": !sidebarState.isOpen,
        }
      )}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between relative">
          {sidebarState.isOpen && (
            <div className="text-[13px] px-2 py-1.5 flex items-center gap-x-2 rounded-md bg-neutral-200/60">
              <FolderIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-gray-800">
                {note.folder.name}
              </span>
            </div>
          )}
          {sidebarState.isOpen ? (
            <PanelLeft
              className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-neutral-700 transition"
              onClick={() =>
                setSidebarState({
                  isOpen: false,
                })
              }
            />
          ) : (
            <PanelLeftOpen
              className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-neutral-700 transition absolute -left-2 top-1"
              onClick={() =>
                setSidebarState({
                  isOpen: true,
                })
              }
            />
          )}
        </div>

        {sidebarState.isOpen && (
          <div>
            {isLoading || isFetching ? (
              <p>Loading...</p>
            ) : !folders || folders.length === 0 ? (
              <p>No folders</p>
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
                        {[
                          { id: "ALL_NOTES", name: "All Notes" },
                          ...folders,
                        ].map((folder) => (
                          <>
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          </>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <CreateFolderDialog
                      setActiveFolderId={(folderId: string) =>
                        setActiveFolderId(folderId)
                      }
                    /> */}
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

                  <NoteLists
                    activeFolder={activeFolder}
                    activeNoteId={note.id}
                    folders={folders}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {sidebarState.isOpen && (
        <CreateNoteDialog folderId={activeFolderId} noteType="PERSONAL">
          <Button type="button" className="mt-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </CreateNoteDialog>
      )}
    </aside>
  );
};
