import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

export default function page() {
  return (
    <div className="flex flex-col gap-y-8 px-5 pb-10 pt-5 md:px-10">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p className="text-muted-foreground">
          Privacy policy for {siteConfig.name}.
        </p>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          What information do we collect?
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            We collect information from you when you register on our site or
            fill out a form.
          </p>
          <p className="text-sm font-light">
            When registering on our site, as appropriate, you may be asked to
            enter your: name, e-mail address or mailing address. You may,
            however, visit our site anonymously.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          What do we use your information for?
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            Any of the information we collect from you may be used in one of the
            following ways:
          </p>
          <ul className="space-y-3">
            <li className="text-sm font-light">
              To personalize your experience (your information helps us to
              better respond to your individual needs)
            </li>
            <li className="text-sm font-light">
              To improve our website (we continually strive to improve our
              website offerings based on the information and feedback we receive
              from you)
            </li>
            <li className="text-sm font-light">
              To improve customer service (your information helps us to more
              effectively respond to your customer service requests and support
              needs)
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Do we use cookies?
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            Yes (Cookies are small files that a site or its service provider
            transfers to your computers hard drive through your Web browser (if
            you allow) that enables the sites or service providers systems to
            recognize your browser and capture and remember certain
            information).
          </p>
          <p className="text-sm font-light">
            We use cookies to help us remember and process the animes in your
            watchlist, understand and save your preferences for future visits,
            keep track of advertisements and compile aggregate data about site
            traffic and site interaction so that we can offer better site
            experiences and tools in the future. We may contract with
            third-party service providers to assist us in better understanding
            our site visitors. These service providers are not permitted to use
            the information collected on our behalf except to help us conduct
            and improve our business.
          </p>
          <p className="text-sm font-light">
            If you prefer, you can choose to have your computer warn you each
            time a cookie is being sent, or you can choose to turn off all
            cookies via your browser settings. Like most websites, if you turn
            your cookies off, some of our services may not function properly.
            However, you can still review animes and add them to your watchlist.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Do we disclose any information to outside parties?
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            We do not sell, trade, or otherwise transfer to outside parties your
            personally identifiable information. This does not include trusted
            third parties who assist us in operating our website, conducting our
            business, or servicing you, so long as those parties agree to keep
            this information confidential. We may also release your information
            when we believe release is appropriate to comply with the law,
            enforce our site policies, or protect ours or others rights,
            property, or safety. However, non-personally identifiable visitor
            information may be provided to other parties for marketing,
            advertising, or other uses.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Third party links
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            Occasionally, at our discretion, we may include or offer third party
            products or services on our website. These third party sites have
            separate and independent privacy policies. We therefore have no
            responsibility or liability for the content and activities of these
            linked sites. Nonetheless, we seek to protect the integrity of our
            site and welcome any feedback about these sites.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Childrens Online Privacy Protection Act Compliance
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            We are in compliance with the requirements of COPPA (Childrens
            Online Privacy Protection Act), we do not collect any information
            from anyone under 13 years of age. Our website, products and
            services are all directed to people who are at least 13 years old or
            older.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Online Privacy Policy Only
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            This online privacy policy applies only to information collected
            through our website and not to information collected offline.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Cancellation policy
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <ul className="space-y-3">
            <li className="text-sm font-light">
              <span className="font-semibold">
                Cancellations Made 24 Hours After Payment:
              </span>{" "}
              Full refund.
            </li>
            <li className="text-sm font-light">
              <span className="font-semibold">
                Cancellations Made 24-48 Hours After Payment:
              </span>{" "}
              50% refund.
            </li>
            <li className="text-sm font-light">
              <span className="font-semibold">
                Cancellations Made More Than 48 Hours After Payment:
              </span>{" "}
              No refund.
            </li>
            <li className="text-sm font-light">
              <span className="font-semibold">No-Shows:</span> No refund.
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Shipping Policy
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <ul className="space-y-3">
            <li className="text-sm font-light">
              <span className="font-semibold">Order Delivering Time:</span>{" "}
              Orders are delivered within 1-2 business days (excluding weekends
              and holidays) after receiving your credits purchase request. You
              will receive a notification when your purchase is successfully
              processed.
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            Please also visit our Terms and Conditions section establishing the
            use, disclaimers, and limitations of liability governing the use of
            our website at{" "}
            <Link
              href="/terms"
              className="font-semibold underline underline-offset-4"
            >{`${siteConfig.url}/terms`}</Link>
            .
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Your Consent</h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            By using our site, you consent to our privacy policy.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Changes to our Privacy Policy
        </h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            If we decide to change our privacy policy, we will post those
            changes on this page, and/or update the Privacy Policy modification
            date below.
          </p>
          <p className="text-sm font-light">
            This policy was last modified on {siteConfig.privacyLastModified}.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Contacting Us</h1>
        <Separator className="my-2" />
        <div className="mt-4 space-y-5">
          <p className="text-sm font-light">
            If there are any questions regarding this privacy policy you may
            contact us using the information below.
          </p>
          <Link
            href="/terms"
            className="text-sm font-semibold underline underline-offset-4"
          >{`${siteConfig.url}/contact`}</Link>
        </div>
      </div>

      <div className="flex w-full items-center justify-between pt-4">
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 md:px-4",
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Contact
        </Link>
        <Link
          href="/terms"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 md:px-4",
          )}
        >
          Terms & Conditions <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
