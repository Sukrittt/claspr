import { createTRPCRouter } from "@/server/trpc";
import {
  createFolder,
  getFolders,
  createNote,
  editFolder,
  removeFolder,
} from "@/server/folder/routes";

export const folderRouter = createTRPCRouter({
  createFolder,
  getFolders,
  createNote,
  editFolder,
  removeFolder,
});
