import { Suspense } from "react";

import { Report } from "@/components/server-components/Report";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export default function page() {
  return (
    <Suspense fallback={<LoadingScreen fullHeight />}>
      <Report />
    </Suspense>
  );
}
