import { createTRPCRouter } from "@/server/trpc";
import { makePayment } from "@/server/payment/routes";

export const paymentRouter = createTRPCRouter({
  makePayment,
});
