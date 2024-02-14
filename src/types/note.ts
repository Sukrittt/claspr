import { Folder, Note } from "@prisma/client";

export type MinifiedNote = Pick<
  Note,
  "id" | "title" | "folderId" | "emojiUrl" | "createdAt"
>;

export type ExtendedNote = Note & {
  folder: Pick<Folder, "id" | "name">;
};
