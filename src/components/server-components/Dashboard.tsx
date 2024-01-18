import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Dashboard = async () => {
  const session = await getAuthSession();

  const dbUser = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
  });

  if (!session || !dbUser) redirect("/sign-in");

  if (!dbUser.role) redirect("/onboarding");

  return <DashboardLayout role={dbUser.role} />;
};
