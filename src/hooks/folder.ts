import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

import { MinifiedFolder, MinifiedNote } from "@/types";
import { toast } from "sonner";

export const usePersonalFolders = () => {
  return trpc.folder.getFolders.useQuery();
};

export const useCreateFolder = ({
  handleCleanUps,
}: {
  handleCleanUps: (folder: MinifiedFolder) => void;
}) => {
  const utils = trpc.useUtils();

  return trpc.folder.createFolder.useMutation({
    onSuccess: (folder) => {
      handleCleanUps(folder);
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useEditFolder = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.folder.editFolder.useMutation({
    onMutate: async ({ folderId, name }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData(undefined, (prev) =>
        prev?.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                name,
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

export const useRemoveFolder = ({ closeModal }: { closeModal: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.folder.removeFolder.useMutation({
    onMutate: async ({ folderId }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData(undefined, (prev) =>
        prev?.filter((folder) => folder.id !== folderId)
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

export const useCreateNote = ({
  handleCleanUps,
}: {
  handleCleanUps: (note: MinifiedNote) => void;
}) => {
  const utils = trpc.useUtils();
  const router = useRouter();

  return trpc.folder.createNote.useMutation({
    onSuccess: (note) => {
      router.push(`/n/${note.id}`);

      handleCleanUps(note);
      utils.folder.getFolders.invalidate();
    },
  });
};
