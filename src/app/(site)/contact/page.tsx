import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { contacts, siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

export default function page() {
  return (
    <div className="flex flex-col gap-y-8 px-5 pb-10 pt-5 md:px-10">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <p className="text-muted-foreground">
          Contact us for any questions or concerns about {siteConfig.name}.
        </p>

        <Separator className="mt-2" />
      </div>

      <ul className="mx-5 flex flex-col gap-y-2">
        {contacts.map((contactInfo, index) => (
          <li key={index} className="list-disc">
            <span className="font-semibold">{contactInfo.label}</span>:{" "}
            <Link
              href={contactInfo.href}
              target="_blank"
              className="font-medium tracking-tight underline underline-offset-4"
            >
              {contactInfo.linkLabel}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex w-full items-center justify-between">
        <Link
          href="/about"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 md:px-4",
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          About
        </Link>
        <Link
          href="/privacy"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 md:px-4",
          )}
        >
          Privacy Policy <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
