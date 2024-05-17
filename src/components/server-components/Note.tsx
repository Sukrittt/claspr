import { notFound } from "next/navigation";

import { getShortenedText } from "@/lib/utils";
import { serverClient } from "@/trpc/server-client";
import { NoteLayout } from "@/components/note/note-layout";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";

export const Note = async ({ noteId }: { noteId: string }) => {
  const note = await serverClient.note.getNote({
    noteId,
    noteType: "PERSONAL",
  });

  if (!note) notFound();

  return (
    <BreadcrumbProvider
      breadcrumbs={[
        {
          label: getShortenedText(note.title, 25),
          href: `/n/${noteId}`,
        },
      ]}
    >
      <NoteLayout note={note} />
    </BreadcrumbProvider>
  );
};
