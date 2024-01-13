import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { OnboardForm } from "@/components/onboarding/onboard-form";

export default async function page() {
  const session = await getAuthSession();

  const dbUser = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
  });

  if (!session || !dbUser) redirect("/sign-in");

  if (dbUser.role) redirect("/dashboard");

  return <OnboardForm />;
}
