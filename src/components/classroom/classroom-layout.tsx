"use client";
import { useEffect } from "react";
import { Session } from "next-auth";
import { UserType } from "@prisma/client";

import { trpc } from "@/trpc/client";
import { useMounted } from "@/hooks/use-mounted";
import { ExtendedClassroomDetails } from "@/types";
import { ClassroomContainer } from "./classroom-container";
import { AIDialog } from "@/components/conversation/ai-dialog";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";

interface ClassroomLayoutProps {
  classroom: ExtendedClassroomDetails;
  session: Session;
  userRole: UserType;
}

export const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({
  classroom,
  session,
  userRole,
}) => {
  const mounted = useMounted();

  const { mutate: updateViewCount } = trpc.class.updateViewCount.useMutation();

  useEffect(() => {
    if (!mounted) return;
    updateViewCount({ classroomId: classroom.id });
  }, [mounted]);

  const additionalInfo =
    `This is the title of this classroom: ${classroom.title}. ` +
    (classroom.description
      ? `This is the description of this classroom: ${classroom.description}.`
      : "");

  return (
    <BreadcrumbProvider
      breadcrumbs={[
        {
          label: classroom.title,
          href: `/c/${classroom.id}`,
        },
      ]}
    >
      <div className="px-20 py-6 h-[95%]">
        <ClassroomContainer
          classroom={classroom}
          session={session}
          userRole={userRole}
        />
        <AIDialog classroom={classroom} hasFollowUp addInfo={additionalInfo} />
      </div>
    </BreadcrumbProvider>
  );
};
