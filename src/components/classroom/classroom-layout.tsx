"use client";
import { useEffect } from "react";
import { Session } from "next-auth";

import { trpc } from "@/trpc/client";
import { useMounted } from "@/hooks/use-mounted";
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

  const { mutate: updateViewCount } = trpc.class.updateViewCount.useMutation();

  useEffect(() => {
    if (mounted) {
      updateViewCount({ classroomId: classroom.id });
    }
  }, [mounted]);

  return (
    <div className="px-20 py-6 h-[95%]">
      <ClassroomContainer classroom={classroom} session={session} />
      <AIDialog classroom={classroom} hasFollowUp />
    </div>
  );
};
