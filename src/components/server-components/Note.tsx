import { notFound } from "next/navigation";

import { serverClient } from "@/trpc/server-client";
import { NoteLayout } from "@/components/note/note-layout";

export const Note = async ({ noteId }: { noteId: string }) => {
  const note = await serverClient.note.getNote({
    noteId,
    noteType: "PERSONAL",
  });

  if (!note) notFound();

  return <NoteLayout note={note} />;
};
