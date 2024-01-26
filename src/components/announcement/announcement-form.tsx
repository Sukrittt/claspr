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
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { TitleInputSkeleton } from "@/components/skeletons/title-input";

const announcementSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Announcement name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<"title-input" | "content-input" | "ask-submission">
  >;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  title,
  setTitle,
  setStep,
}) => {
  const mounted = useMounted();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title,
    },
  });

  function onSubmit(data: Inputs) {
    setTitle(data.title);
    setStep("content-input");
  }

  if (!mounted) return <TitleInputSkeleton />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-2"
      >
        <Form {...form}>
          <form
            id="anouncement-creation-form"
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
                      <Input
                        type="text"
                        placeholder="E.g: Data Structures Assignment"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      className="h-9 w-9 py-1"
                      size="icon"
                      form="anouncement-creation-form"
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
