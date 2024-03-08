import { Suspense } from "react";

import { Navbar } from "@/components/site-layout/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingScreen } from "@/components/skeletons/loading-screen";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ScrollArea className="h-screen flex flex-col pr-0">
        <Suspense fallback={<LoadingScreen fullHeight />}>
          <Navbar />
        </Suspense>

        <div className="h-[94vh]">{children}</div>
      </ScrollArea>
    </main>
  );
}
