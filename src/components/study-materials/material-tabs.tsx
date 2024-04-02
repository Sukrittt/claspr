import { useAtom } from "jotai";
import { useEffect } from "react";
import { Folder } from "lucide-react";
import { UserType } from "@prisma/client";
import { useFolders } from "@/hooks/folder";
import { useSortable } from "@dnd-kit/sortable";
import { useSearchParams } from "next/navigation";
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
import { useUpdateViewCount } from "@/hooks/note";
import { MaterialContext } from "./material-context";
import { useQueryChange } from "@/hooks/use-query-change";
import { NoteSearch } from "@/components/note/note-search";
import { MaterialTabsSkeleton } from "@/components/skeletons/material-skeleton";
import { CreateFolderDialog } from "@/components/folder/dialog/create-folder-dialog";

interface MaterialsProps {
  classroomId: string;
  userRole: UserType;
}

export const MaterialTabs: React.FC<MaterialsProps> = ({
  classroomId,
  userRole,
}) => {
  const [folders, setFolders] = useAtom(classFolderAtom);
  const [, setIsLoadingFolders] = useAtom(globalLoaderAtom);
  const [, setActiveNoteId] = useAtom(activeNoteIdAtom);

  const handleQueryChange = useQueryChange();

  const { mutate: updateViews } = useUpdateViewCount();
  const { data: serverFolders, isLoading } = useFolders(classroomId);

  useEffect(() => {
    if (serverFolders) {
      setFolders(serverFolders);
    }
  }, [serverFolders]);

  useEffect(() => {
    setIsLoadingFolders(isLoading);
  }, [isLoading]);

  const handleNoteClick = (noteId: string) => {
    updateViews({ noteId });

    setActiveNoteId(noteId);
    handleQueryChange(`/c/${classroomId}`, { note: noteId });
  };

  const popularVisits = folders.flatMap((folder) => {
    const sortedNotes = folder.notes
      .filter((note) => note?.viewCount != null && note.viewCount > 0)
      .sort((a, b) => b.viewCount! - a.viewCount!) // 'viewCount' will be defined as it has already been filtered out
      .slice(0, 5);

    return sortedNotes.map((note) => ({
      noteId: note.id,
      noteTitle: note.title,
    }));
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="tracking-tight font-medium text-[13px]">Folders</h3>

        <div className="flex items-center gap-x-2">
          <NoteSearch
            noteType="CLASSROOM"
            classroomId={classroomId}
            handleNoteClick={handleNoteClick}
            popularVisits={popularVisits}
          />
          {userRole === "TEACHER" && (
            <CreateFolderDialog classroomId={classroomId} />
          )}
        </div>
      </div>
      <ScrollArea className="md:h-[68vh]">
        <div className="space-y-2">
          {isLoading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
              <MaterialTabsSkeleton />
            </div>
          ) : !folders || folders.length === 0 ? (
            <p className="text-xs text-muted-foreground tracking-tight">
              Your folders will appear here.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MaterialContext
                  classroomId={classroomId}
                  folders={folders}
                  userRole={userRole}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface MaterialTabProps {
  folder: ExtendedFolder;
  isFirstFolder?: boolean;
  classroomId: string;
  isHolding?: boolean;
  userRole: UserType;
}

export const MaterialTab: React.FC<MaterialTabProps> = ({
  folder,
  isFirstFolder = false,
  classroomId,
  isHolding = false,
  userRole,
}) => {
  const params = useSearchParams();

  const handleQueryChange = useQueryChange();

  const [, setActiveNoteId] = useAtom(activeNoteIdAtom);
  const [activeFolderId, setActiveFolderId] = useAtom(activeClassFolderIdAtom);

  const activeNote = params.get("note");
  const activeFolder = params.get("folder");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: folder.id,
    data: { content: folder },
    disabled: userRole === "STUDENT",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  useEffect(() => {
    if (activeFolder) {
      setActiveFolderId(activeFolder);
    }

    if (activeNote) {
      setActiveNoteId(activeNote);
    }
  }, [params]);

  useEffect(() => {
    if (!isFirstFolder || !!activeFolder) return;

    const initialUrl = `/c/${classroomId}`;

    handleQueryChange(initialUrl, {
      folder: folder.id,
      tab: "study-materials",
      note: null,
    });

    setActiveFolderId(folder.id);
    setActiveNoteId(null);
  }, [isFirstFolder]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        id="always-on-show"
        className={cn(
          "py-1 px-2.5 mb-2 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-[13px] cursor-pointer group focus:outline-none",
          {
            "bg-neutral-100 dark:bg-neutral-800 font-medium":
              activeFolderId === folder.id,
          }
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="border rounded-md p-1.5">
            <Folder className="h-3.5 w-3.5" />
          </div>
          <p>{getShortenedText(folder.name, 25)}</p>
        </div>

        {userRole === "TEACHER" && (
          <div className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition">
            <FolderDropdown folder={folder} classroomId={classroomId} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      id="always-on-show"
      className={cn(
        "py-1 px-2.5 mb-2 flex items-center justify-between focus:outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-[13px] cursor-pointer group",
        {
          "bg-neutral-100 dark:bg-neutral-800 font-medium":
            activeFolderId === folder.id,
          "cursor-grabbing bg-background/60 opacity-60": isHolding,
        }
      )}
      onClick={() => {
        const initialUrl = `/c/${classroomId}`;
        handleQueryChange(initialUrl, { folder: folder.id, note: null });

        setActiveFolderId(folder.id);
        setActiveNoteId(null);
      }}
    >
      <div
        className={cn("flex items-center gap-x-2", { "opacity-60": isHolding })}
      >
        <div className="border rounded-md p-1.5">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <p>{getShortenedText(folder.name, 25)}</p>
      </div>

      {userRole === "TEACHER" && (
        <div
          className={cn("opacity-0 group-hover:opacity-100 transition", {
            "opacity-60": isHolding,
          })}
        >
          <FolderDropdown folder={folder} classroomId={classroomId} />
        </div>
      )}
    </div>
  );
};
