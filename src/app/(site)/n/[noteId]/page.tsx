import { Suspense } from "react";

import { db } from "@/lib/db";
import { Note } from "@/components/server-components/Note";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface NotePageProps {
  params: {
    noteId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { noteId: string };
}) {
  const { noteId } = params;

  const note = await db.note.findUnique({
    where: { id: noteId },
    select: {
      title: true,
    },
  });

  return {
    title: SITE_TITLE.NOTE(note?.title || "Note"),
    description: SITE_DESCRIPTION.NOTE(note?.title || "Note"),
  };
}

export default async function page({ params }: NotePageProps) {
  const { noteId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Note noteId={noteId} />
    </Suspense>
  );
}
