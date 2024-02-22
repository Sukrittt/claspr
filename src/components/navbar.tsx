import Link from "next/link";

import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/custom/user-avatar";
import { UserDropdown } from "@/components/custom/user-dropdown";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="py-3 border-b border-slate-300 px-8 lg:px-20 h-[8vh] flex items-center justify-between">
      <Link href="/" className="font-bold tracking-tight">
        Scribe.
      </Link>
      {session ? (
        <UserDropdown user={session.user}>
          <UserAvatar user={session.user} className="h-7 w-7 cursor-pointer" />
        </UserDropdown>
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
