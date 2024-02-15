import { createTRPCRouter } from "@/server/trpc";

import {
  createNote,
  editNote,
  removeNote,
  getNote,
  moveNote,
} from "@/server/note/routes";

export const noteRouter = createTRPCRouter({
  createNote,
  editNote,
  removeNote,
  getNote,
  moveNote,
});
