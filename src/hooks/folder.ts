import { trpc } from "@/trpc/client";
import { MinifiedFolder } from "@/types";

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
    },
  });
};
