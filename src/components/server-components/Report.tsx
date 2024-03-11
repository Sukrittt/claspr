import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { ReportForm } from "@/components/report/report-form";
import { ReportAnalysis } from "@/components/report/report-analysis";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export const Report = async () => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  return session.user.email === ADMIN_EMAIL ? (
    <ReportAnalysis />
  ) : (
    <div className="space-y-4 pt-32 pb-8 px-10 h-screen">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="font-extrabold text-6xl text-neutral-800">
          Contact the Team
        </h1>
        <p className="text-lg text-muted-foreground font-medium tracking-tight">
          Need help? Found a bug? Have a suggestion? Let us know!
        </p>
      </div>

      <ReportForm />
    </div>
  );
};
