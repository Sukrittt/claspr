import { createTRPCRouter } from "@/server/trpc";

import {
  createNote,
  editNote,
  removeNote,
  getNote,
  moveNote,
  updateContent,
  updateCover,
  getNoteCover,
} from "@/server/note/routes";

export const noteRouter = createTRPCRouter({
  createNote,
  editNote,
  removeNote,
  getNote,
  moveNote,
  updateContent,
  updateCover,
  getNoteCover,
});
