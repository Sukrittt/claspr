import { Suspense } from "react";

import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Onboarding } from "@/components/server-components/Onboarding";

export async function generateMetadata() {
  return {
    title: SITE_TITLE.ONBOARDING,
    description: SITE_DESCRIPTION.ONBOARDING,
  };
}

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen fullHeight />}>
      <Onboarding />
    </Suspense>
  );
}
