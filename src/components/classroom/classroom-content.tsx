"use client";
import { useEffect } from "react";

import { trpc } from "@/trpc/client";
import { useMounted } from "@/hooks/use-mounted";

interface ClassroomContentProps {
  classroomId: string;
}
export const ClassroomContent: React.FC<ClassroomContentProps> = ({
  classroomId,
}) => {
  const mounted = useMounted();
  const { mutate: updateViewCount } = trpc.class.updateViewCount.useMutation();

  useEffect(() => {
    if (mounted) {
      updateViewCount({ classroomId });
    }
  }, [mounted]);

  return <div>{classroomId}</div>;
};
