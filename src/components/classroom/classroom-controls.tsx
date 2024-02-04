import Link from "next/link";
import { useState } from "react";
import { Loader } from "lucide-react";

import { ExtendedClassroomDetails } from "@/types";
import { ClassroomSorting } from "./classroom-sorting";
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
      <ClassroomSorting />
      {isTeacher && (
        <Link
          href={`/c/${classroom.id}/create`}
          className={buttonVariants()}
          onClick={() => setLoading(true)}
        >
          {loading ? (
            <div className="h-3 w-[108px] flex justify-center items-center">
              <Loader className="h-3 w-3 animate-spin" />
            </div>
          ) : (
            "Create assignment"
          )}
        </Link>
      )}
    </div>
  );
};
