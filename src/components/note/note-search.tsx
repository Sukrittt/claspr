import Image from "next/image";
import { NoteType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { trpc } from "@/trpc/client";
import { useMounted } from "@/hooks/use-mounted";
import { cn, getShortenedText } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { CommandDialog } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ContainerHeightVariants, ContainerVariants } from "@/lib/motion";
import { NoteSearchSkeleton } from "@/components/skeletons/note-search-skeleton";

interface NoteSearchProps {
  noteType: NoteType;
  classroomId?: string;
  handleNoteClick?: (noteId: string) => void;
  popularVisits?: { noteId: string; noteTitle: string }[];
}

export const NoteSearch: React.FC<NoteSearchProps> = ({
  noteType,
  classroomId,
  handleNoteClick,
  popularVisits,
}) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const mounted = useMounted();
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: fetchedNotes,
    isFetching,
    refetch,
  } = trpc.note.getNoteByTitle.useQuery(
    { title: query, noteType, classroomId },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const trimmedQuery = debouncedQuery.trim();

    if (trimmedQuery && trimmedQuery.length > 0) {
      refetch();
    }
  }, [debouncedQuery, refetch, mounted]);

  return (
    <div>
      <CustomTooltip text="ctrl + k">
        <div
          className="p-1 flex items-center justify-center rounded-md cursor-pointer hover:text-gray-700 transition hover:bg-neutral-200"
          onClick={() => setOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <div className="sr-only">Search Notes</div>
        </div>
      </CustomTooltip>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="border-b relative">
          <input
            className="px-9 text-sm h-12 outline-none w-full"
            placeholder="Search for your note..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-4 text-muted-foreground h-4 w-4" />
        </div>

        <AnimatePresence mode="wait">
          {isFetching ? (
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <NoteSearchSkeleton />
            </motion.div>
          ) : !debouncedQuery && popularVisits && popularVisits.length > 0 ? (
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-tight px-4 py-2">
                Popular Visits
              </p>

              {popularVisits.map(({ noteId, noteTitle }) => (
                <div
                  key={noteId}
                  onClick={() => {
                    handleNoteClick?.(noteId);
                    setOpen(false);
                  }}
                  className="flex items-center gap-x-2 hover:bg-neutral-100 transition cursor-pointer px-4 py-2"
                >
                  <div className="border rounded-md p-1.5 text-gray-800">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm text-neutral-800 tracking-tight">
                    {getShortenedText(noteTitle, 30)}
                  </p>
                </div>
              ))}
            </div>
          ) : debouncedQuery && (!fetchedNotes || fetchedNotes.length === 0) ? (
            <motion.div
              variants={ContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <p className="py-6 text-center text-sm text-muted-foreground">
                We couldn&rsquo;t find any note with{" "}
                <span className="font-semibold">{query}</span>.
              </p>
            </motion.div>
          ) : (
            fetchedNotes && (
              <ScrollArea
                className={cn("pr-0", {
                  "h-[250px]": fetchedNotes.length > 5,
                })}
              >
                <motion.div
                  variants={ContainerHeightVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col gap-y-2"
                >
                  {fetchedNotes.map((note) => (
                    <div
                      onClick={() => {
                        if (handleNoteClick) {
                          handleNoteClick(note.id);
                          setOpen(false);
                          return;
                        }

                        router.push(`/n/${note.id}`);
                      }}
                      key={note.id}
                      className="py-2 px-4 hover:bg-neutral-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-x-2">
                        {note.emojiUrl ? (
                          <div className="p-1.5">
                            <div className="h-4 w-4 relative">
                              <Image
                                src={note.emojiUrl}
                                className="object-contain"
                                alt={note.title}
                                fill
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="border rounded-md p-1.5 text-gray-800">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <p className="text-sm text-neutral-800 tracking-tight">
                          {getShortenedText(note.title, 30)}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </ScrollArea>
            )
          )}
        </AnimatePresence>
      </CommandDialog>
    </div>
  );
};
