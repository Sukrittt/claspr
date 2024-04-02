import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OptionType } from "./page/teacher-view";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface AssignmentOptionsDropdownProps {
  setTabValue: React.Dispatch<React.SetStateAction<string>>;
  tabOptions: OptionType[];
  tabValue: string;
}

export const AssignmentOptionsDropdown: React.FC<
  AssignmentOptionsDropdownProps
> = ({ setTabValue, tabOptions, tabValue }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="lg:hidden">
          <CustomTooltip text="More options">
            <div className="text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 p-1 rounded-md transition">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </div>
          </CustomTooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-4 lg:ml-0">
        {tabOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn("py-1.5", {
              "bg-accent": tabValue === option.value,
            })}
            onClick={() => setTabValue(option.value)}
          >
            <div className="flex items-center space-x-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
