import { notFound } from "next/navigation";

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
          label: note.title,
          href: `/n/${noteId}`,
        },
      ]}
    >
      <NoteLayout note={note} />
    </BreadcrumbProvider>
  );
};
