import { Suspense } from "react";

import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";
import { Event } from "@/components/server-components/Event";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export async function generateMetadata() {
  return {
    title: SITE_TITLE.CALENDAR,
    description: SITE_DESCRIPTION.CALENDAR,
  };
}

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Event />
    </Suspense>
  );
}
