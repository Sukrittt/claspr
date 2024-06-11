import { toast } from "sonner";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { creditModalAtom } from "@/atoms";

export const usePayment = () => {
  const router = useRouter();
  const [, setCreditModal] = useAtom(creditModalAtom);


  return trpc.payment.makePayment.useMutation({
    onSuccess: (_, { credits }) => {
      toast.success(
        `Payment Successful. We've added ${credits} credit${credits > 1 ? "s" : ""} to your account.`,
      );

      router.refresh();
      setCreditModal(false)
    },
  });
};

export const usePaymentHistory = () => {
  return trpc.payment.getPaymentHistory.useQuery();
};
