import Link from "next/link";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/custom/user-avatar";
import { UserDropdown } from "@/components/custom/user-dropdown";

export const Navbar = async () => {
  const session = await getAuthSession();

  const userWithRole = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      role: true,
    },
  });

  return (
    <nav className="py-3 border-b border-slate-300 px-8 lg:px-28 flex items-center justify-between">
      <Link href="/" className="font-semibold">
        Scribe.
      </Link>
      {session && userWithRole ? (
        <UserDropdown>
          <UserAvatar user={session.user} userRole={userWithRole.role} />
        </UserDropdown>
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
