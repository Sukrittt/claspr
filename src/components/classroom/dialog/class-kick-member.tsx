"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useKickMember } from "@/hooks/class";
import { Button } from "@/components/ui/button";

type KickMemberDialogProps = {
  memberId: string;
};

export const KickMemberDialog = ({ memberId }: KickMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: kickMember, isLoading } = useKickMember({
    closeModal: () => setOpen(false),
  });

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>
        <span
          className={cn(
            "cursor-pointer hover:underline underline-offset-4 hover:text-destructive transition",
            {
              "opacity-50 cursor-default": isLoading,
            }
          )}
        >
          Kick member
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently kick this member
            from this classroom and he/she will lose all their progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={() => kickMember({ membershipId: memberId })}
            className="pt-2"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-[52px] animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
