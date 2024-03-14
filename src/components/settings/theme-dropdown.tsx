import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ThemeDropdown = () => {
  const { theme, setTheme } = useTheme();

  const dropdownItems = [
    {
      value: "light",
      label: "Light",
    },
    {
      value: "dark",
      label: "Dark",
    },
    {
      value: "system",
      label: "System",
    },
  ] as const;

  type Theme = (typeof dropdownItems)[number]["value"];

  return (
    <Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
      <SelectTrigger className="w-fit border-none hover:bg-neutral-200 transition">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {dropdownItems.map((item, index) => (
          <SelectItem key={index} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
