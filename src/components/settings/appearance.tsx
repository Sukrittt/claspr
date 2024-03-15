import { ThemeDropdown } from "./theme-dropdown";

export const Appearance = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1 tracking-tight">
          <p className="text-sm text-neutral-800 dark:text-foreground">
            Appearnance
          </p>
          <p className="text-muted-foreground font-medium text-xs">
            Customize how Scribe looks on your device.
          </p>
        </div>

        <ThemeDropdown />
      </div>
    </div>
  );
};
