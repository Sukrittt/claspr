import { Suspense } from "react";

import { Dashboard } from "@/components/server-components/Dashboard";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Dashboard />
    </Suspense>
  );
}
