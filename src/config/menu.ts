import { Bug, CalendarDays, Home, Settings } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Calendar",
    icon: CalendarDays,
    href: "/calendar",
  },
];

export const otherItems = [
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    label: "Report a Bug",
    icon: Bug,
    href: "/report",
  },
];
