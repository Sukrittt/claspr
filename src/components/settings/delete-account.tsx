import { toast } from "sonner";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { ChevronRight, Loader2 } from "lucide-react";

import { trpc } from "@/trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const DeleteAccount = ({ sessionId }: { sessionId: string }) => {
  const [open, setOpen] = useState(false);
  const [startedDeletion, setStartedDeletion] = useState(false);
  const [userId] = useState(sessionId); // In case signOut() makes the session null

  const { mutate: deleteAccount, isLoading } =
    trpc.user.deleteAccount.useMutation({
      onSuccess: () => {
        toast.success("Your account has been deleted");

        setStartedDeletion(false);
        setOpen(false);
      },
    });

  const handleDeleteAccount = () => {
    setStartedDeletion(true);

    signOut({
      callbackUrl: `${window.location.origin}`,
    });

    deleteAccount({
      userId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>
        <div className="h-6 w-6 rounded-md cursor-pointer hover:bg-neutral-200 transition flex items-center justify-center">
          <ChevronRight className="h-4 w-4" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently delete your account
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDeleteAccount}
            className="pt-2"
            disabled={startedDeletion || isLoading}
          >
            {startedDeletion || isLoading ? (
              <Loader2 className="h-3.5 w-[3.25rem] animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
