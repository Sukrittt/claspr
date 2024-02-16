import { toast } from "sonner";
import { NoteType } from "@prisma/client";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { MinifiedNote } from "@/types";

export const useCreateNote = ({
  handleCleanUps,
}: {
  handleCleanUps: (note: MinifiedNote) => void;
}) => {
  const utils = trpc.useUtils();
  const router = useRouter();

  return trpc.note.createNote.useMutation({
    onSuccess: (note) => {
      router.push(`/n/${note.id}`);

      handleCleanUps(note);
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useEditNote = ({
  closeModal,
  folderId,
}: {
  closeModal?: () => void;
  folderId: string;
}) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.note.editNote.useMutation({
    onMutate: async ({ noteId, title, emojiUrl }) => {
      closeModal?.();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData(undefined, (prev) =>
        prev?.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                notes: folder.notes.map((note) =>
                  note.id === noteId
                    ? {
                        ...note,
                        title: title ?? note.title,
                        emojiUrl: emojiUrl ?? note.emojiUrl,
                      }
                    : note
                ),
              }
            : folder
        )
      );

      return { prevFolders };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.folder.getFolders.setData(undefined, ctx?.prevFolders);
    },
    onSuccess: () => {
      router.refresh();
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useRemoveNote = ({
  closeModal,
  folderId,
}: {
  closeModal: () => void;
  folderId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.removeNote.useMutation({
    onMutate: async ({ noteId }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData(undefined, (prev) =>
        prev?.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                notes: folder.notes.filter((note) => note.id !== noteId),
              }
            : folder
        )
      );

      return { prevFolders };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.folder.getFolders.setData(undefined, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useMoveNote = ({
  closeModal,
  oldFolderId,
}: {
  closeModal: () => void;
  oldFolderId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.moveNote.useMutation({
    onMutate: async ({ noteId, folderId: newFolderId }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData(undefined, (prev) => {
        let filteredNote: MinifiedNote | null = null;

        const updatedFolders = prev?.map((folder) => {
          if (folder.id === oldFolderId) {
            const notes = folder.notes.filter((note) => {
              const match = note.id === noteId;

              if (match) {
                filteredNote = note;
              }

              return !match;
            });

            return {
              ...folder,
              notes,
            };
          } else if (folder.id === newFolderId) {
            return {
              ...folder,
              notes: filteredNote
                ? [...folder.notes, filteredNote]
                : [...folder.notes],
            };
          } else {
            return folder;
          }
        });

        return updatedFolders;
      });

      return { prevFolders };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.folder.getFolders.setData(undefined, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useUpdateNoteContent = () => {
  return trpc.note.updateContent.useMutation({
    onError: () => {
      toast.error(
        "Your changes were not saved. Please refresh the page and try again."
      );
    },
  });
};

export const useNoteCover = (noteId: string) => {
  return trpc.note.getNoteCover.useQuery({ noteId });
};

export const useUpdateNoteCover = ({
  closePopover,
}: {
  closePopover: () => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.updateCover.useMutation({
    onMutate: async ({ coverImage, noteId, gradientClass }) => {
      closePopover();

      await utils.note.getNoteCover.cancel({ noteId });

      const prevNoteCover = utils.note.getNoteCover.getData();

      utils.note.getNoteCover.setData(
        { noteId },
        {
          coverImage,
          gradientClass,
        }
      );

      return { prevNoteCover };
    },
    onError: (error, { noteId }, ctx) => {
      toast.error(error.message);

      utils.note.getNoteCover.setData({ noteId }, ctx?.prevNoteCover);
    },
    onSettled: (data, _, { noteId }) => {
      utils.note.getNoteCover.invalidate({ noteId });
    },
  });
};

interface GetNoteProps {
  noteId: string;
  noteType: NoteType;
  classroomId?: string;
}

export const useNote = ({ noteId, noteType, classroomId }: GetNoteProps) => {
  return trpc.note.getNote.useQuery({
    noteId,
    noteType,
    classroomId,
  });
};
