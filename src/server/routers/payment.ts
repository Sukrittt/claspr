import { createTRPCRouter } from "@/server/trpc";
import { makePayment, getPaymentHistory } from "@/server/payment/routes";

export const paymentRouter = createTRPCRouter({
  makePayment,
  getPaymentHistory,
});
