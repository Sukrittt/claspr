import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

import { MinifiedFolder, MinifiedNote } from "@/types";

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
