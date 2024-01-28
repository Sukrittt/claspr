import { notFound } from "next/navigation";
import { serverClient } from "@/trpc/server-client";

interface PartOfClassProps {
  children: React.ReactNode;
  classroomId: string;
}

export const PartOfClass: React.FC<PartOfClassProps> = async ({
  children,
  classroomId,
}) => {
  const isPartOfClass = await serverClient.class.getIsPartOfClass({
    classroomId,
  });

  if (!isPartOfClass) notFound();

  return <>{children}</>;
};
