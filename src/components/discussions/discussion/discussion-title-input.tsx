import { z } from "zod";
import { useForm } from "react-hook-form";
import { MoveRightIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ContainerInputVariants } from "@/lib/motion";
import { Button } from "@/components/ui/button";

interface DiscussionTitleInputProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<"title-input" | "content-input">
  >;
  placeholder: string;
}

const createDiscussionSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Discussion title cannot be empty" }
    ),
});

type Inputs = z.infer<typeof createDiscussionSchema>;

export const DiscussionTitleInput: React.FC<DiscussionTitleInputProps> = ({
  setStep,
  setTitle,
  title,
  placeholder,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title,
    },
  });

  function onSubmit(data: Inputs) {
    setTitle(data.title);
    setStep("content-input");
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerInputVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-2"
      >
        <Form {...form}>
          <form
            id="assignment-creation-form"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Title</FormLabel>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Input type="text" placeholder={placeholder} {...field} />
                    </FormControl>
                    <Button
                      className="h-9 w-9 py-1"
                      size="icon"
                      form="assignment-creation-form"
                    >
                      <MoveRightIcon className="w-4 h-4" />
                      <span className="sr-only">Next Step</span>
                    </Button>
                  </div>
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
