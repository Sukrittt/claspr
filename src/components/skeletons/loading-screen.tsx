import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

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
      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
      Getting things ready...
    </div>
  );
};
