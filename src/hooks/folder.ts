import { toast } from "sonner";
import { trpc } from "@/trpc/client";

import { MinifiedFolder } from "@/types";

export const useFolders = (classroomId?: string) => {
  return trpc.folder.getFolders.useQuery({ classroomId });
};

export const useCreateFolder = ({
  handleCleanUps,
  classroomId,
}: {
  handleCleanUps: (folder: MinifiedFolder) => void;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.folder.createFolder.useMutation({
    onSuccess: (folder) => {
      handleCleanUps(folder);
      utils.folder.getFolders.invalidate({ classroomId });
    },
  });
};

export const useEditFolder = ({
  closeModal,
  classroomId,
}: {
  closeModal: () => void;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.folder.editFolder.useMutation({
    onMutate: async ({ folderId, name }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData({ classroomId }, (prev) =>
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

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useRemoveFolder = ({
  closeModal,
  classroomId,
}: {
  closeModal: () => void;
  classroomId?: string;
}) => {
  const utils = trpc.useUtils();

  return trpc.folder.removeFolder.useMutation({
    onMutate: async ({ folderId }) => {
      closeModal();

      await utils.folder.getFolders.cancel();

      const prevFolders = utils.folder.getFolders.getData();

      utils.folder.getFolders.setData({ classroomId }, (prev) =>
        prev?.filter((folder) => folder.id !== folderId)
      );

      return { prevFolders };
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      utils.folder.getFolders.setData({ classroomId }, ctx?.prevFolders);
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};

export const useReorderFolder = () => {
  const utils = trpc.useUtils();

  return trpc.folder.reorderFolder.useMutation({
    onError: () => {
      toast.error("Your changes were not saved. Please refresh your page.");
    },
    onSettled: () => {
      utils.folder.getFolders.invalidate();
    },
  });
};
