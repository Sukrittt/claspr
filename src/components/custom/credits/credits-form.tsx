import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { UserType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pricingStrategy } from "@/config/ai";
import { Button } from "@/components/ui/button";
import { useRazorPay } from "@/hooks/useRazorpay";

const creditsFormSchema = z.object({
  credits: z
    .string()
    .min(1, { message: "Credits cannot be empty" })
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Credits cannot be empty" },
    ),
});

type Inputs = z.infer<typeof creditsFormSchema>;

interface CreditsFormProps {
  username: string;
  role: UserType;
}

export const CreditsForm: React.FC<CreditsFormProps> = ({ role, username }) => {
  const [amount, setAmount] = useState(0);

  const { makePayment, isLoading } = useRazorPay();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(creditsFormSchema),
    defaultValues: {
      credits: "",
    },
  });

  const credits = form.watch("credits");

  const getTotalAmount = useCallback(
    (rawCredits: string) => {
      const credits = parseInt(rawCredits);

      if (!credits) {
        setAmount(0);
        return;
      }

      let totalAmt = 0;

      switch (role) {
        case "STUDENT":
          totalAmt = pricingStrategy.STUDENT.perCredit * credits;
          setAmount(totalAmt);
        case "TEACHER":
          totalAmt = pricingStrategy.TEACHER.perCredit * credits;
          setAmount(totalAmt);
      }
    },
    [role],
  );

  useEffect(() => {
    getTotalAmount(credits);
  }, [credits, getTotalAmount]);

  function onSubmit(data: Inputs) {
    if (data.credits.length === 0) {
      toast.error("Please enter a valid number of credits");
      return;
    }

    const parsedCredits = parseInt(credits);
    makePayment({ amount, credits: parsedCredits, username });
  }

  return (
    <div className="space-y-4 pt-2">
      <Form {...form}>
        <form
          id="credits-purchase-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          className="space-y-4 overflow-hidden"
        >
          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={isLoading}
                      type="number"
                      placeholder="E.g: 10"
                      {...field}
                    />
                    <div className="absolute right-8 top-2.5 text-xs font-semibold text-muted-foreground">
                      {amount.toLocaleString()} INR
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="pt-2">
        <Button
          className="mb-1 w-full"
          form="credits-purchase-form"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            "Purchase"
          )}
          <span className="sr-only">Purchase</span>
        </Button>
      </div>
    </div>
  );
};
