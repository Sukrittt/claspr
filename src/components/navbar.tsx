import Link from "next/link";

import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/custom/user-avatar";
import { UserDropdown } from "@/components/custom/user-dropdown";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="py-3 border-b border-slate-300 px-8 lg:px-28 flex items-center justify-between">
      <Link href="/" className="font-semibold text-lg">
        Scribe.
      </Link>
      {session ? (
        <UserDropdown user={session.user}>
          <UserAvatar user={session.user} className="h-8 w-8" />
        </UserDropdown>
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
