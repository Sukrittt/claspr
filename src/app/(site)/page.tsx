import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Link href="/sign-in" className={buttonVariants()}>
        Sign In
      </Link>
    </div>
  );
}
