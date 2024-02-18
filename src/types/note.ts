import { ClassRoom, Folder, Note, Topic } from "@prisma/client";

export type MinifiedNote = Pick<
  Note,
  "id" | "title" | "folderId" | "emojiUrl" | "createdAt" | "classroomId"
>;

export type MinifiedTopic = Pick<Topic, "id" | "name" | "noteId">;

export type ExtendedNote = Note & {
  folder: Pick<Folder, "id" | "name">;
  topics: MinifiedTopic[];
  classroom: Pick<ClassRoom, "title"> | null;
};
