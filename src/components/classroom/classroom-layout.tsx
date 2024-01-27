"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Session } from "next-auth";

import { trpc } from "@/trpc/client";
import { descriptionAtom } from "@/atoms";
import { useMounted } from "@/hooks/use-mounted";
import { ClassroomCard } from "./classroom-card";
import { UpcomingEvents } from "./upcoming-events";
import { ExtendedClassroomDetails } from "@/types";
import { ClassroomContainer } from "./classroom-container";
import { AIDialog } from "@/components/conversation/ai-dialog";

interface ClassroomLayoutProps {
  classroom: ExtendedClassroomDetails;
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
        <ClassroomContainer classroom={classroom} session={session} />
      </div>
      <div className="col-span-2 flex flex-col gap-y-4">
        <ClassroomCard classroom={classroom} sessionId={session.user.id} />
        <UpcomingEvents classroom={classroom} />
      </div>
      <AIDialog classroom={classroom} />
    </div>
  );
};
