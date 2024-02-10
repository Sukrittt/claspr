import { z } from "zod";
import { useForm } from "react-hook-form";
import { ArrowUpFromDot, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAddReply } from "@/hooks/reply";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReplyInputProps {
  discussionId: string;
  replyId?: string;
}

const replyPostingSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(80)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Your reply cannot be empty" }
    ),
});

type Inputs = z.infer<typeof replyPostingSchema>;

export const ReplyInput: React.FC<ReplyInputProps> = ({
  discussionId,
  replyId,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(replyPostingSchema),
    defaultValues: {
      text: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const { mutate: addReply, isLoading } = useAddReply({ resetForm });

  function handleAddReply(data: Inputs) {
    addReply({
      ...data,
      discussionId,
      replyId,
    });
  }

  function onSubmit(data: Inputs) {
    handleAddReply(data);
  }

  const disabled = isLoading || form.getValues("text").length === 0;

  return (
    <Form {...form}>
      <form
        id="reply-creation-form"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="p-2 border-t"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    className="h-7 text-xs focus-visible:ring-0 w-full pr-7"
                    disabled={isLoading}
                    autoComplete="off"
                    placeholder="Write a reply..."
                    {...field}
                  />

                  <div className="absolute top-[3px] right-1">
                    <Button
                      form="reply-creation-form"
                      className="h-[22px] w-[22px]"
                      disabled={disabled}
                      size="icon"
                      variant="ghost"
                    >
                      {isLoading ? (
                        <Loader className="h-3 w-3 text-muted-foreground animate-spin" />
                      ) : (
                        <ArrowUpFromDot className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
