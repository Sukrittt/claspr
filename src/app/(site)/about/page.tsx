import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { features, siteConfig, socials, techStack } from "@/config/site";

export default function page() {
  return (
    <div className="flex flex-col gap-y-8 px-5 pb-10 pt-5 md:px-10">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-muted-foreground">
          About the project and the author of the project.
        </p>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Tech stack used
        </h1>
        <Separator className="my-2" />
        <ul className="mx-5 mt-2 space-y-2">
          {techStack.map((tech, index) => (
            <li key={index} className="list-disc">
              <Link
                href={tech.url}
                target="_blank"
                className="font-medium tracking-tight underline underline-offset-4"
              >
                {tech.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Credits</h1>
        <Separator className="my-2" />
        <ul className="mx-5 mt-2 list-disc space-y-2">
          <li>
            <Link
              href="https://ui.shadcn.com/"
              target="_blank"
              className="font-medium tracking-tight underline underline-offset-4"
            >
              shadcn/ui
            </Link>{" "}
            - For the awesome reusable components library
          </li>
          <li>
            <Link
              href="https://aniwatch.to/home"
              target="_blank"
              className="font-medium tracking-tight underline underline-offset-4"
            >
              Aceternity UI
            </Link>{" "}
            - For providing animated{" "}
            <Link
              className="font-medium tracking-tight underline-offset-4 hover:underline"
              href="https://www.framer.com/motion/"
              target="_blank"
            >
              framer motion
            </Link>{" "}
            components for our landing page
          </li>
        </ul>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Key features</h1>
        <Separator className="my-2" />
        <ul className="mx-5 mt-2 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="list-disc">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          About the author
        </h1>
        <Separator className="my-2" />
        <ul className="mx-5 mt-2 space-y-2">
          {socials.map((social) => (
            <li key={social.id} className="list-disc">
              <Link
                href={social.href}
                target="_blank"
                className="font-medium tracking-tight underline underline-offset-4"
              >
                {social.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full items-center justify-end">
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 md:px-4",
          )}
        >
          Contact <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
