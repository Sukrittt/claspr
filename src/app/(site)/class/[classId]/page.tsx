import { ClassroomContent } from "@/components/classroom/classroom-content";

interface ClassPageProps {
  params: {
    classId: string;
  };
}

export default async function page({ params }: ClassPageProps) {
  const { classId } = params;

  return <ClassroomContent classroomId={classId} />;
}
