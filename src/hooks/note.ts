import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { FormattedNote } from "@/types/note";

export const useCreateNote = ({
  handleCleanUps,
  classroomId,
}: {
  handleCleanUps: (note: FormattedNote) => void;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();
  const router = useRouter();

  return trpc.note.createNote.useMutation({
    onSuccess: (note) => {
      if (!classroomId) {
        router.push(`/n/${note.id}`);
      }

      handleCleanUps(note);
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

interface EditNoteProps {
  closeModal?: () => void;
  onComplete?: () => void;
  folderId: string;
  classroomId?: string;
}

export const useEditNote = ({
  closeModal,
  folderId,
  onComplete,
  classroomId,
}: EditNoteProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.note.editNote.useMutation({
    onMutate: async ({ noteId, title, emojiUrl }) => {
      closeModal?.();

      await utils.folder.getFolders.cancel({ classroomId });

      const prevFolders = utils.folder.getFolders.getData({ classroomId });

      utils.folder.getFolders.setData({ classroomId }, (prev) =>
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

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSuccess: () => {
      router.refresh();
      onComplete?.();
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useRemoveNote = ({
  closeModal,
  folderId,
  classroomId,
}: {
  closeModal: () => void;
  folderId: string;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.removeNote.useMutation({
    onMutate: async ({ noteId }) => {
      closeModal();

      await utils.folder.getFolders.cancel({ classroomId });

      const prevFolders = utils.folder.getFolders.getData({ classroomId });

      utils.folder.getFolders.setData({ classroomId }, (prev) =>
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

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useMoveNote = ({
  closeModal,
  oldFolderId,
  classroomId,
}: {
  closeModal: () => void;
  oldFolderId: string;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.moveNote.useMutation({
    onMutate: async ({ noteId, folderId: newFolderId }) => {
      closeModal();

      await utils.folder.getFolders.cancel({ classroomId });

      const prevFolders = utils.folder.getFolders.getData({ classroomId });

      utils.folder.getFolders.setData({ classroomId }, (prev) => {
        let filteredNote: FormattedNote | null = null;

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

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useUpdateNoteContent = (classroomId?: string) => {
  const utils = trpc.useUtils();

  return trpc.note.updateContent.useMutation({
    onSuccess: () => {
      utils.folder.getFolders.invalidate({ classroomId });
    },
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

export const useAttachTopics = ({
  closeModal,
  classroomId,
}: {
  closeModal: () => void;
  classroomId?: string;
}) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.note.attachTopics.useMutation({
    onSuccess: () => {
      closeModal();
      router.refresh();
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useRemoveTopics = (folderId: string, classroomId?: string) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.note.removeTopics.useMutation({
    onMutate: async ({ noteId, topicIds }) => {
      await utils.folder.getFolders.cancel({ classroomId });

      const prevFolders = utils.folder.getFolders.getData({ classroomId });

      utils.folder.getFolders.setData({ classroomId }, (prev) =>
        prev?.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                notes: folder.notes.map((note) =>
                  note.id === noteId
                    ? {
                        ...note,
                        topics: note.topics.filter(
                          (topic) => !topicIds.includes(topic.id)
                        ),
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

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSuccess: () => {
      router.refresh();
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useUpdateViewCount = () => {
  return trpc.note.updateViewCount.useMutation();
};
