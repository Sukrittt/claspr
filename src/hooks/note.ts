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
  closeModal: () => void;
  folderId: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.note.editNote.useMutation({
    onMutate: async ({ noteId, title }) => {
      closeModal();

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
                        title,
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
