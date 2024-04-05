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
  attachTopic,
  removeTopics,
  getNoteByTitle,
  updateViewCount,
  renameTopic,
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
  attachTopic,
  removeTopics,
  getNoteByTitle,
  updateViewCount,
  renameTopic,
});
