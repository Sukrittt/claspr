import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Note } from "@/components/server-components/Note";

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
