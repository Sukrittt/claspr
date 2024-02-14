import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";

interface NotePageProps {
  params: {
    noteId: string;
  };
}

export default async function page({ params }: NotePageProps) {
  const { noteId } = params;

  return (
    // <Suspense fallback={<LoadingScreen />}>
    //   <Classroom classroomId={classId} />
    // </Suspense>
    <p>{noteId}</p>
  );
}
