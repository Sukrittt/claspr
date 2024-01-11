import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  const dbUser = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
  });

  if (!session || !dbUser) redirect("/sign-in");

  if (dbUser.role) redirect("/dashboard");

  return (
    <div className="h-screen flex items-center justify-center">Onboarding</div>
  );
}
