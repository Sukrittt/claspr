import { z } from "zod";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { NovuEvent, novu } from "@/lib/novu";

/**
 * To make a payment and add credits to the user's account.
 *
 * @param {object} input - The input parameters for making a payment.
 * @param {enum} input.amount - The amount to be paid.
 * @param {enum} input.credits - The credits to be added to the user's account.
 */
export const makePayment = privateProcedure
  .input(
    z.object({
      amount: z.number().positive(),
      credits: z.number().positive(),
      razorpay_payment_id: z.string(),
      razorpay_order_id: z.string(),
      razorpay_signature: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const {
      amount,
      credits,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = input;

    const promises = [
      db.user.update({
        where: { id: ctx.userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      }),
      db.payment.create({
        data: {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          amount,
          credits,
          userId: ctx.userId,
        },
      }),
    ];

    await Promise.all(promises);

    const novuPromises = [
      novu.trigger(NovuEvent.Claspr, {
        to: {
          subscriberId: ctx.userId,
          email: ctx.email ?? "",
          firstName: ctx.username ?? "",
        },
        payload: {
          message: `We have received your payment of ${amount.toLocaleString()} INR.`,
          url: "PAYMENT_HISTORY",
        },
      }),
      novu.trigger(NovuEvent.Claspr, {
        to: {
          subscriberId: ctx.userId,
          email: ctx.email ?? "",
          firstName: ctx.username ?? "",
        },
        payload: {
          message: `You have received ${credits} credit${credits > 1 && "s"}.`,
        },
      }),
    ];

    await Promise.all(novuPromises);
  });

/**
 * To get the payment history of the user.
 */
export const getPaymentHistory = privateProcedure.query(async ({ ctx }) => {
  return db.payment.findMany({
    where: {
      userId: ctx.userId,
    },
    select: {
      id: true,
      razorpay_order_id: true,
      amount: true,
      credits: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});
