import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { Calendar } from "@/components/event/calendar";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";

export const Event = async () => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  return (
    <BreadcrumbProvider
      breadcrumbs={[
        {
          label: "Calendar",
          href: `/calendar`,
        },
      ]}
    >
      <Calendar sessionId={session.user.id} />
    </BreadcrumbProvider>
  );
};
