import Razorpay from "razorpay";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { amount: rawAmount } = await req.json();

  const amount = rawAmount as number;

  // Initialize razorpay object
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // Create an order -> generate the OrderID -> Send it to the Front-end
  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: randomUUID(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);

    return new Response(
      JSON.stringify({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      }),
    );
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
}
