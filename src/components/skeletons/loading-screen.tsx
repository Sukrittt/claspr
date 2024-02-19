import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const LoadingScreen = ({
  fullHeight = false,
}: {
  fullHeight?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[85vh] flex items-center justify-center text-gray-700 text-sm",
        {
          "h-screen": fullHeight,
        }
      )}
    >
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Getting things ready...
    </div>
  );
};
