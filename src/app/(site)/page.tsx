import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="flex justify-center mx-auto items-center w-full max-w-[64rem] flex-col gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:pt-48 lg:pb-10"
      >
        <div className="flex flex-col gap-y-1 items-center">
          <div className="rounded-full w-fit text-muted-foreground text-xs py-1 px-4 border border-slate-300">
            Powered by AI
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Your Go-To Classroom Companion
          </h1>
        </div>
        <Balancer className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
          The only classroom companion you&rsquo;ll ever need, ensuring
          comprehensive support and seamless learning experiences across various
          subjects.
        </Balancer>
        <Link href="/sign-in" className={buttonVariants()}>
          Get Started
        </Link>
      </section>
    </div>
  );
}
