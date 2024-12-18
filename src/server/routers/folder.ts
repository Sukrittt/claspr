import { createTRPCRouter } from "@/server/trpc";
import {
  createFolder,
  getFolders,
  editFolder,
  removeFolder,
  reorderFolder,
} from "@/server/folder/routes";

export const folderRouter = createTRPCRouter({
  createFolder,
  getFolders,
  editFolder,
  removeFolder,
  reorderFolder,
});
