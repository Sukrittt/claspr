import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="h-[85vh] flex items-center justify-center text-gray-700 text-sm">
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Getting things ready...
    </div>
  );
};
