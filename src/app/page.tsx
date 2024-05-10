import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

import { buttonVariants } from "@/components/ui/button";
import { ProductDescTabs } from "@/components/landing-page/product-desc-tabs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-[150px] pb-20">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="flex justify-center mx-auto items-center w-full max-w-[64rem] flex-col gap-8 text-center pt-48 pb-10"
      >
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl font-medium leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Organize, Engage, Elevate
          </h1>
          <Balancer className="max-w-[46rem] text-lg text-neutral-700 dark:text-neutral-400 sm:text-xl">
            Elevate your classroom with Scribe. Chat with AI, customize,
            collaborate. Join the revolution!
          </Balancer>
        </div>

        <Link href="/sign-in" className={buttonVariants()}>
          Get Started
        </Link>

        <ProductDescTabs />
      </section>

      <Link
        href="github.com/sukrittt"
        target="_blank"
        className="px-3 py-1 rounded-full border fixed bottom-4 right-4 text-sm tracking-tight font-medium hover:bg-neutral-300 dark:hover:bg-neutral-800 transition"
      >
        Built by Sukrit
      </Link>
    </div>
  );
}
