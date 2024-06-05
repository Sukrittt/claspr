"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { UserType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { creditModalAtom, creditsAtom } from "@/atoms";
import { CustomTooltip } from "@/components/custom/custom-tooltip";
import { CreditsForm } from "@/components/custom/credits/credits-form";

interface CreditsProps {
  credits: number | null;
  role: UserType;
  username: string;
}

export const Credits: React.FC<CreditsProps> = ({
  credits: dbCredits,
  role,
  username,
}) => {
  const [credits, setCredits] = useAtom(creditsAtom);
  const [creditModal, setCreditModal] = useAtom(creditModalAtom);

  useEffect(() => {
    if (!dbCredits && dbCredits !== 0) return;

    setCredits(dbCredits);
  }, [dbCredits, setCredits]);

  return (
    <Dialog open={creditModal} onOpenChange={(val) => setCreditModal(val)}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-full border px-2.5 py-1 text-xs transition hover:bg-neutral-200 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
          <CustomTooltip text={`You have ${credits} credits left`}>
            <div>
              {credits || credits === 0 ? (
                <div className="flex items-center justify-center gap-x-2">
                  <Clock className="h-4 w-4" />
                  {credits}
                </div>
              ) : (
                <Skeleton className="h-4 w-12" />
              )}
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            Purchase credits to use our AI features.
          </DialogDescription>

          <CreditsForm role={role} username={username} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
