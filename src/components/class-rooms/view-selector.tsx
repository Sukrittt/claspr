import { LayoutGrid, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { ViewType } from "@/hooks/use-view";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CreateClassDialog } from "./create-class-dialog";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { JoinClassDialog } from "./join-class-dialog";

interface ViewSelectorProps {
  layoutView: ViewType;
  setView: (view: ViewType) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  setView,
  layoutView,
}) => {
  const mounted = useMounted();

  if (!mounted) {
    return <Skeleton className="w-20 h-5" />;
  }

  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <CustomTooltip text="Grid View">
          <div
            onClick={() =>
              setView({
                ...layoutView,
                view: "grid",
              })
            }
            className={cn("p-2", {
              "bg-accent rounded-md": layoutView.view === "grid",
            })}
          >
            <LayoutGrid
              className={cn(
                "w-4 h-4 hover:text-gray-700 transition cursor-pointer"
              )}
            />
            <div className="sr-only">Grid View</div>
          </div>
        </CustomTooltip>
        <CustomTooltip text="List View">
          <div
            onClick={() =>
              setView({
                ...layoutView,
                view: "list",
              })
            }
            className={cn("p-2", {
              "bg-accent rounded-md": layoutView.view === "list",
            })}
          >
            <Menu className="w-4 h-4 hover:text-gray-700 transition cursor-pointer" />
            <div className="sr-only">List View</div>
          </div>
        </CustomTooltip>
      </div>
      <Separator orientation="vertical" className="h-4 bg-muted-foreground" />
      {layoutView.section === "created" ? (
        <CreateClassDialog />
      ) : (
        <JoinClassDialog />
      )}
    </div>
  );
};
