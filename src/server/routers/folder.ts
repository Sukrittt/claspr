import { createTRPCRouter } from "@/server/trpc";
import { createFolder, getFolders } from "@/server/folder/routes";

export const folderRouter = createTRPCRouter({
  createFolder,
  getFolders,
});
