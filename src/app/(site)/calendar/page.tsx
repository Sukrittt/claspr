import { Suspense } from "react";

import { LoadingScreen } from "@/components/skeletons/loading-screen";
import { Calendar } from "@/components/server-components/Calendar";

export default function page() {
  return (
    // <Suspense fallback={<LoadingScreen />}>
    <Calendar />
    // {/* </Suspense> */}
  );
}
