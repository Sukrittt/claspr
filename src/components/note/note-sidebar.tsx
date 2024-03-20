"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  MonitorX,
  PanelLeft,
  PanelLeftOpen,
  Plus,
} from "lucide-react";

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
import { useFolders } from "@/hooks/folder";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBreadCrumbs } from "@/hooks/use-breadcrumbs";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { CreateNoteDialog } from "./dialog/create-note-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { FolderDropdown } from "@/components/folder/folder-dropdown";
import { NoteSidebarSkeleton } from "@/components/skeletons/note-sidebar-skeleton";

export const NoteSidebar = ({ note }: { note: ExtendedNote }) => {
  const { data: folders, isLoading } = useFolders();
  const [sidebarState, setSidebarState] = useSidebarState();
  const { handleChangeBreadcrumb } = useBreadCrumbs();

  const [activeFolderId, setActiveFolderId] = useState(note.folder.id);

  const activeFolder = useMemo(
    () => folders?.find((folder) => folder.id === activeFolderId),
    [activeFolderId, folders]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "\\" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSidebarState({
          isOpen: !sidebarState.isOpen,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarState.isOpen, setSidebarState]);

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
            <Link
              href="/dashboard"
              onClick={() =>
                handleChangeBreadcrumb({
                  href: "/dashboard",
                  label: "Dashboard",
                })
              }
              className="text-[13px] px-2 py-1.5 flex items-center gap-x-2 rounded-md bg-neutral-200/60 dark:bg-neutral-800 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-gray-800 dark:text-foreground">
                Go back
              </span>
            </Link>
          )}
          {sidebarState.isOpen ? (
            <CustomTooltip text="Ctrl + \">
              <PanelLeft
                className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-neutral-700 transition"
                onClick={() =>
                  setSidebarState({
                    isOpen: false,
                  })
                }
              />
            </CustomTooltip>
          ) : (
            <CustomTooltip text="Ctrl + \">
              <PanelLeftOpen
                className="cursor-pointer h-4 w-4 text-muted-foreground hover:text-neutral-700 transition absolute -left-2 top-1"
                onClick={() =>
                  setSidebarState({
                    isOpen: true,
                  })
                }
              />
            </CustomTooltip>
          )}
        </div>

        {sidebarState.isOpen && (
          <div>
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
                        {[
                          { id: "ALL_NOTES", name: "All Notes" },
                          ...folders,
                        ].map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
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
