import { Navbar } from "@/components/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ScrollArea className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
      </ScrollArea>
    </main>
  );
}
