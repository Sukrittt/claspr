import { Folder, Note } from "@prisma/client";

export type MinifiedFolder = Pick<
  Folder,
  "id" | "name" | "createdAt" | "order"
>;

export type MinifiedNote = Pick<Note, "id" | "title" | "folderId" | "emojiUrl">;

export type ExtendedFolder = MinifiedFolder & {
  notes: MinifiedNote[];
};