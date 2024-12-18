import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { StudentWork } from "./student-work";
import { ExtendedClassroomDetails } from "@/types";
import { buttonVariants } from "@/components/ui/button";

interface ClassroomControlProps {
  classroom: ExtendedClassroomDetails;
  sessionId: string;
}

export const ClassroomControls: React.FC<ClassroomControlProps> = ({
  classroom,
  sessionId,
}) => {
  const [loading, setLoading] = useState(false);

  const studentDetails = classroom.students.find(
    (student) => student.userId === sessionId
  );

  const isTeacher =
    classroom.teacher.id === sessionId || studentDetails?.isTeacher;

  return (
    <div className="flex items-center gap-x-2">
      {isTeacher ? (
        <Link
          href={`/c/${classroom.id}/create`}
          className={cn(buttonVariants(), {
            "opacity-50 cursor-default": loading,
          })}
          onClick={() => setLoading(true)}
        >
          {loading ? (
            <div className="h-3 w-[108px] flex justify-center items-center">
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          ) : (
            "Create assignment"
          )}
        </Link>
      ) : (
        <StudentWork classroomId={classroom.id} />
      )}
    </div>
  );
};
