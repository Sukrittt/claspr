import { Suspense } from "react";

import { Note } from "@/components/server-components/Note";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

interface NotePageProps {
  params: {
    noteId: string;
  };
}

export default async function page({ params }: NotePageProps) {
  const { noteId } = params;

  return (
    <Suspense fallback={<LoadingScreen fullHeight />}>
      <Note noteId={noteId} />
    </Suspense>
  );
}
