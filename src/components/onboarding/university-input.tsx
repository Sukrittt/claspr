import { z } from "zod";
import { toast } from "sonner";
import { UserType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";

interface UniversityInputProps {
  role: UserType;
}

const ERROR_MESSAGE_STARTING = "University name must be";

const universityInputSchema = z.object({
  university: z
    .string()
    .min(3, { message: ERROR_MESSAGE_STARTING + " atleast 3 charater(s)" })
    .max(50, { message: ERROR_MESSAGE_STARTING + " atmost 50 charater(s)" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: ERROR_MESSAGE_STARTING + " alphanumeric",
    })
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "University name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof universityInputSchema>;

export const UniversityInput: React.FC<UniversityInputProps> = ({ role }) => {
  const router = useRouter();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(universityInputSchema),
    defaultValues: {
      university: "",
    },
  });

  const { mutate: onBoardUser, isLoading } = trpc.user.onBoardUser.useMutation({
    onSuccess: () => {
      toast.success("Welcome to Scribe", {
        position: "bottom-center",
      });
      router.push("/dashboard");
    },
  });

  function handleOnboardUser(data: Inputs) {
    onBoardUser({
      university: data.university,
      role,
    });
  }

  function onSubmit(data: Inputs) {
    handleOnboardUser(data);
  }

  const formLabel =
    role == "TEACHER"
      ? "In which university do you teach?"
      : "In which university do you study?";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 w-full sm:w-auto sm:min-w-[400px]"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Form {...form}>
          <form
            id="onboard-form"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200 text-sm">
                    {formLabel}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-x-2 items-center">
                      <Input
                        type="text"
                        className="h-[30px] text-[13px]"
                        disabled={isLoading}
                        placeholder="E.g: Christ University"
                        {...field}
                      />
                      <Button
                        className="w-10 p-0"
                        form="onboard-form"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2
                            className="h-3 w-3 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        <span className="sr-only">Continue</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};
