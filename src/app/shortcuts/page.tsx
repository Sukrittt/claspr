import { shortcuts } from "@/config/shortcuts";
import { Separator } from "@/components/ui/separator";

export default function page() {
  return (
    <div className="space-y-4 py-8 px-10 h-screen">
      <div className="space-y-1">
        <h3 className="text-lg font-medium tracking-tight">
          Keyboard Shortcuts
        </h3>
        <p className="text-sm text-muted-foreground">
          Master these keyboard shortcuts to speed up your workflow.
        </p>
      </div>

      <Separator />

      <div className="flex justify-around flex-wrap gap-12">
        {shortcuts.map((shortcut, index) => (
          <div className="space-y-4" key={index}>
            <h4 className="font-semibold tracking-tight">{shortcut.label}</h4>

            {shortcut.shortcuts.map((item, i) => (
              <div key={i} className="flex flex-col gap-y-2">
                <p className="text-sm">{item.description}</p>
                <kbd className="font-semibold text-sm">{item.keys}</kbd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
