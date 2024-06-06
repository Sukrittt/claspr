"use client";
import { useAtom } from "jotai";
import { format } from "date-fns";
import { Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContainerVariants } from "@/lib/motion";
import { paymentHistoryModalAtom } from "@/atoms";
import { usePaymentHistory } from "@/hooks/payment";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentHistorySkeleton } from "@/components/skeletons/payment-history-skeleton";

interface PaymentHistoryDialogProps {
  paymentHistoryModal: boolean;
}

export const PaymentHistoryDialog: React.FC<PaymentHistoryDialogProps> = ({
  paymentHistoryModal,
}) => {
  const [open, setOpen] = useState(false);
  const [, setPaymentHistoryModal] = useAtom(paymentHistoryModalAtom);

  const { data: paymentHistory, isLoading } = usePaymentHistory();

  useEffect(() => {
    setOpen(paymentHistoryModal);
  }, [paymentHistoryModal]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setPaymentHistoryModal(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p className="flex cursor-pointer items-center gap-x-2 rounded-md px-2 py-1 text-muted-foreground transition hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-300">
          <Receipt className="h-3.5 w-3.5" />
          <span className="text-[13px] font-medium tracking-tight">
            Payment History
          </span>
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>View your payment history</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-2 pt-2 text-xs tracking-tight">
          <p className="col-span-2">INVOICE</p>
          <p className="text-center">AMOUNT</p>
          <p className="text-center">CREDITS</p>
          <p className="col-span-2">CREATED</p>
        </div>

        <Separator />

        <ScrollArea className="h-[50vh]">
          <div className="flex flex-col gap-y-4">
            {isLoading ? (
              <PaymentHistorySkeleton />
            ) : !paymentHistory || paymentHistory.length === 0 ? (
              <p className="pt-4 text-center text-sm text-muted-foreground">
                No payment history found
              </p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  variants={ContainerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col gap-y-4"
                >
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="grid grid-cols-6 gap-2 text-sm"
                    >
                      <p className="col-span-2">{payment.razorpay_order_id}</p>
                      <p className="text-center">
                        {payment.amount.toLocaleString()} INR
                      </p>
                      <p className="text-center">{payment.credits}</p>
                      <p className="col-span-2">
                        {format(payment.createdAt, "MMMM do, yy, h:mm a")}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
