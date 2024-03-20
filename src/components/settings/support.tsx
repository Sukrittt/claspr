import { DeleteAccount } from "./delete-account";

export const Support = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1 tracking-tight">
          <p className="text-sm text-destructive dark:text-[#eb5757]">
            Delete my account
          </p>
          <p className="text-muted-foreground text-xs font-medium">
            Permanently delete my account and all my data.
          </p>
        </div>

        <DeleteAccount sessionId={sessionId} />
      </div>
    </div>
  );
};
