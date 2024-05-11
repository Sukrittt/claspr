"use client";
import { useRouter } from "next/navigation";

import { BackgroundBeams } from "@/components/ui/background-beams";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          404
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          The page you are looking for does not exist.{" "}
          <span
            className="font-medium cursor-pointer underline underline-offset-4"
            onClick={() => router.back()}
          >
            Go back
          </span>
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
