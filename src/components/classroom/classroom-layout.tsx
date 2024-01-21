"use client";
import { useEffect } from "react";
import { Session } from "next-auth";
import { useAtom } from "jotai";

import { trpc } from "@/trpc/client";
import { descriptionAtom } from "@/atoms";
import { ExtendedClassroom } from "@/types";
import { useMounted } from "@/hooks/use-mounted";
import { ClassroomCard } from "./classroom-card";
import { ClassAIDialog } from "./class-ai-dialog";
import { UpcomingEvents } from "./upcoming-events";
import { ClassroomContainer } from "./classroom-container";

interface ClassroomLayoutProps {
  classroom: ExtendedClassroom;
  session: Session;
}

export const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({
  classroom,
  session,
}) => {
  const mounted = useMounted();
  const [, setDescription] = useAtom(descriptionAtom);

  const { mutate: updateViewCount } = trpc.class.updateViewCount.useMutation();

  useEffect(() => {
    if (mounted) {
      updateViewCount({ classroomId: classroom.id });
    }

    return () => setDescription(null);
  }, [mounted]);

  return (
    <div className="grid grid-cols-6 gap-4 p-12">
      <div className="col-span-4">
        <ClassroomContainer classroom={classroom} />
      </div>
      <div className="col-span-2 flex flex-col gap-y-4">
        <ClassroomCard classroom={classroom} sessionId={session.user.id} />
        <UpcomingEvents classroom={classroom} />
      </div>
      <ClassAIDialog classroom={classroom} />
    </div>
  );
};
