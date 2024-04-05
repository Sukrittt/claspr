import { Suspense } from "react";

import { Note } from "@/components/server-components/Note";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface NotePageProps {
  params: {
    noteId: string;
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
