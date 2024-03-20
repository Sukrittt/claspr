import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { HamburgMenu } from "./hamburg-menu";
import { BreadCrumbs } from "./bread-crumbs";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = async () => {
  const session = await getAuthSession();

  const dbUser = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true },
  });

  if (!dbUser?.role) redirect("/onboarding");

  return (
    <nav className="py-3 border-b border-slate-300 dark:border-border px-8 h-[6vh] flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        {session && <HamburgMenu role={dbUser.role} session={session} />}

        <BreadCrumbs />
      </div>

      {!session && (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
