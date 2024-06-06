import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

export const usePayment = () => {
  const router = useRouter();

  return trpc.payment.makePayment.useMutation({
    onSuccess: (_, { credits }) => {
      toast.success(
        `Payment Successful. We've added ${credits} credit${credits > 1 ? "s" : ""} to your account.`,
      );
      router.refresh();
    },
  });
};

export const usePaymentHistory = () => {
  return trpc.payment.getPaymentHistory.useQuery();
};
