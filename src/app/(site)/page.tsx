import Link from "next/link";

import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";

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
