import { Suspense } from "react";

import { Event } from "@/components/server-components/Event";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Event />
    </Suspense>
  );
}
