import { useAtom } from "jotai";
import { Session } from "next-auth";
import { UserType } from "@prisma/client";

import { Materials } from "./materials";
import { activeNoteIdAtom } from "@/atoms";
import { MaterialTabs } from "./material-tabs";
import { MaterialDetails } from "./material-details";

interface StudyMaterialLayoutProps {
  classroomId: string;
  session: Session;
  userRole: UserType;
}

export const StudyMaterialLayout: React.FC<StudyMaterialLayoutProps> = ({
  classroomId,
  session,
  userRole,
}) => {
  const [activeNoteId] = useAtom(activeNoteIdAtom);

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="col-span-2">
        <MaterialTabs classroomId={classroomId} userRole={userRole} />
      </div>
      <div className="col-span-6">
        {activeNoteId ? (
          <MaterialDetails
            classroomId={classroomId}
            noteId={activeNoteId}
            session={session}
          />
        ) : (
          <Materials classroomId={classroomId} userRole={userRole} />
        )}
      </div>
    </div>
  );
};
