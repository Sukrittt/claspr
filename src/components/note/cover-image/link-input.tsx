import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContainerVariants } from "@/lib/motion";
import { useUpdateNoteCover } from "@/hooks/note";

const coverLinkInputSchema = z.object({
  coverLink: z
    .string()
    .regex(/^(ftp|http|https):\/\/[^ "]+$/, {
      message: "Please enter a valid link.",
    })
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Cover link cannot be empty" }
    ),
});

type Inputs = z.infer<typeof coverLinkInputSchema>;

interface LinkInputProps {
  noteId: string;
  closePopover: () => void;
}

export const LinkInput: React.FC<LinkInputProps> = ({
  closePopover,
  noteId,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(coverLinkInputSchema),
    defaultValues: {
      coverLink: "",
    },
  });

  const { mutate: updateCover } = useUpdateNoteCover({ closePopover });

  function handleUpdateCover(data: Inputs) {
    updateCover({
      coverImage: data.coverLink,
      noteId,
    });
  }

  function onSubmit(data: Inputs) {
    handleUpdateCover(data);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 pt-1"
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Form {...form}>
          <form
            id="add-link-form"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="coverLink"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      className=""
                      placeholder="Paste an image link."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Button className="my-1 w-full" form="add-link-form">
          Save
          <span className="sr-only">Save</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
