import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { ProductDescTabs } from "@/components/landing-page/product-desc-tabs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-[150px] pb-20">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-8 pb-10 pt-48 text-center"
      >
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl font-medium leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Organize, Engage, Elevate
          </h1>
          <Balancer className="max-w-[46rem] text-lg text-neutral-700 dark:text-neutral-400 sm:text-xl">
            Elevate your classroom with {siteConfig.name}. Chat with AI,
            customize, collaborate. Join the revolution!
          </Balancer>
        </div>

        <Link href="/sign-in" className={buttonVariants()}>
          Get Started
        </Link>

        <div className="hidden md:block">
          <ProductDescTabs />
        </div>
      </section>

      <Link
        href="https://github.com/Sukrittt"
        target="_blank"
        className="fixed bottom-4 right-4 rounded-full border px-3 py-1 text-sm font-medium tracking-tight transition hover:bg-neutral-300 dark:hover:bg-neutral-800"
      >
        Built by Sukrit
      </Link>
    </div>
  );
}
