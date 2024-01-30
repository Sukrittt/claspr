import Link from "next/link";
import { Pacifico } from "next/font/google";

import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/custom/user-avatar";
import { UserDropdown } from "@/components/custom/user-dropdown";

const font = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="py-3 border-b border-slate-300 px-8 lg:px-20 h-[8vh] flex items-center justify-between">
      <Link href="/" className={cn(font.className, "font-semibold text-xl")}>
        Scribe.
      </Link>
      {session ? (
        <UserDropdown user={session.user}>
          <UserAvatar user={session.user} className="h-7 w-7" />
        </UserDropdown>
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
