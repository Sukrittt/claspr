import { Suspense } from "react";

import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { Dashboard } from "@/components/server-components/Dashboard";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export async function generateMetadata() {
  return {
    title: SITE_TITLE.DASHBOARD,
    description: SITE_DESCRIPTION.DASHBOARD,
  };
}

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Dashboard />
    </Suspense>
  );
}
