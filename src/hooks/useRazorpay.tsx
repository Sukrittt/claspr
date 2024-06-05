import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

import { usePayment } from "@/hooks/payment";

type RazorPayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type OrderResponse = {
  currency: string;
  amount: number;
  id: string;
};

type PaymentPayload = {
  username: string;
  amount: number;
  credits: number;
};

export const useRazorPay = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: handleOrderCreation } = usePayment();

  const makePayment = async (payload: PaymentPayload) => {
    setIsLoading(true);

    try {
      const { username, amount, credits } = payload;

      const res = await initializeRazorpay();

      if (!res) {
        alert("Razorpay SDK Failed to load");
        return;
      }

      const response = await axios.post("/api/order", { amount });
      const data = response.data as OrderResponse;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        name: username,
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: "Understanding RazorPay Integration",
        handler: async function (response: RazorPayResponse) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          handleOrderCreation({
            amount,
            credits,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          });
        },
      };

      //@ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        toast.error(
          "Payment failed. Please try again. Contact support for help",
        );
      });
    } catch (error) {
      toast.error("Payment failed. Please try again. Contact support for help");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  return { makePayment, isLoading };
};
