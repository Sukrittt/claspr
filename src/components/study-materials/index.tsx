import { useAtom } from "jotai";
import { Session } from "next-auth";

import { Materials } from "./materials";
import { activeNoteIdAtom } from "@/atoms";
import { MaterialTabs } from "./material-tabs";
import { MaterialDetails } from "./material-details";

interface StudyMaterialLayoutProps {
  classroomId: string;
  session: Session;
}

export const StudyMaterialLayout: React.FC<StudyMaterialLayoutProps> = ({
  classroomId,
  session,
}) => {
  const [activeNoteId] = useAtom(activeNoteIdAtom);

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="col-span-2">
        <MaterialTabs classroomId={classroomId} />
      </div>
      <div className="col-span-6">
        {activeNoteId ? (
          <MaterialDetails noteId={activeNoteId} session={session} />
        ) : (
          <Materials classroomId={classroomId} />
        )}
      </div>
    </div>
  );
};
