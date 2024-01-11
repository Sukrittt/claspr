import Link from "next/link";
import { signOut } from "next-auth/react";

import { getAuthSession } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <div className="h-screen flex items-center justify-center">
      {session ? (
        <>
          <p>{session.user.email}</p>
        </>
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </div>
  );
}
