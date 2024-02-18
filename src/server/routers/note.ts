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
  attachTopics,
  removeTopics,
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
  attachTopics,
  removeTopics,
});
