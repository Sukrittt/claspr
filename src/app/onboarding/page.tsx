import { Suspense } from "react";

import { Onboarding } from "@/components/server-components/Onboarding";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen fullHeight />}>
      <Onboarding />
    </Suspense>
  );
}
