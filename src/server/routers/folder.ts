import { createTRPCRouter } from "@/server/trpc";
import { createFolder, getFolders, createNote } from "@/server/folder/routes";

export const folderRouter = createTRPCRouter({
  createFolder,
  getFolders,
  createNote,
});
