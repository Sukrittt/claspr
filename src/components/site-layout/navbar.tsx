import Link from "next/link";
import { Home } from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { HamburgMenu } from "./hamburg-menu";
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
    <nav className="py-3 border-b border-slate-300 px-8 lg:px-20 h-[6vh] flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        {session && <HamburgMenu role={dbUser.role} session={session} />}

        <Link href="/" className="font-bold tracking-tight">
          <div className="text-neutral-700 hover:bg-neutral-200 cursor-pointer p-1 rounded-md transition">
            <Home className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {!session && (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </nav>
  );
};
