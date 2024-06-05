import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { HamburgMenu } from "./hamburg-menu";
import { BreadCrumbs } from "./bread-crumbs";
import { Credits } from "@/components/custom/credits";
import { buttonVariants } from "@/components/ui/button";
import { NotificationBell } from "@/components/custom/notification-bell";

export const Navbar = async () => {
  const session = await getAuthSession();

  const dbUser = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true, credits: true, name: true },
  });

  if (!dbUser?.role) redirect("/onboarding");

  return (
    <nav className="flex h-[6vh] items-center justify-between border-b border-slate-300 px-4 py-3 dark:border-border sm:px-8">
      <div className="flex items-center gap-x-4">
        {session && <HamburgMenu role={dbUser.role} session={session} />}

        <BreadCrumbs />
      </div>

      {!session ? (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      ) : (
        <div className="flex items-center gap-x-4">
          <Credits
            role={dbUser.role}
            credits={dbUser.credits}
            username={dbUser.name ?? "Unknown"}
          />
          <NotificationBell userId={session.user.id} />
        </div>
      )}
    </nav>
  );
};
