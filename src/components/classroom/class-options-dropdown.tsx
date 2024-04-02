import { MoreHorizontal, UsersRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { ClassroomOptions, OptionType } from "./classroom-container";

interface ClassOptionsDropdownProps {
  setTabValue: React.Dispatch<React.SetStateAction<ClassroomOptions>>;
  isTeacher: boolean;
  tabOptions: OptionType[];
  tabValue: ClassroomOptions;
}

export const ClassOptionsDropdown: React.FC<ClassOptionsDropdownProps> = ({
  setTabValue,
  isTeacher,
  tabOptions,
  tabValue,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="xl:hidden">
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

        {isTeacher && (
          <DropdownMenuItem
            className={cn("py-1.5", {
              "bg-accent": tabValue === "settings",
            })}
            onClick={() => setTabValue("settings")}
          >
            <div className="flex items-center space-x-2">
              <UsersRound className="h-4 w-4" />
              <span>Class Settings</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
