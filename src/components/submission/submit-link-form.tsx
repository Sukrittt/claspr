import { z } from "zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateMedia } from "@/hooks/media";
import { Button } from "@/components/ui/button";

const linkSubmissionSchema = z.object({
  label: z.string().max(50).optional(),
  url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/, {
    message: "Please enter a valid link.",
  }),
});

type Inputs = z.infer<typeof linkSubmissionSchema>;

interface SubmitLinkFormProps {
  closeModal: () => void;
  assignmentId: string;
}

export const SubmitLinkForm: React.FC<SubmitLinkFormProps> = ({
  closeModal,
  assignmentId,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(linkSubmissionSchema),
    defaultValues: {
      url: "",
    },
  });

  const { mutate: createMedia, isLoading } = useCreateMedia({ closeModal });

  const handleSubmit = (data: Inputs) => {
    const label = data.label ?? "Untitled Link";

    createMedia({
      media: [
        {
          ...data,
          label,
        },
      ],
      assignmentId,
      mediaType: "LINK",
    });
  };

  function onSubmit(data: Inputs) {
    handleSubmit(data);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          id="link-submission-form"
          className="grid gap-2"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Label{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="E.g: Link to my work"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="E.g: https://example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        disabled={isLoading}
        className="w-full"
        form="link-submission-form"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          "Add Link"
        )}
        <span className="sr-only">Add Link</span>
      </Button>
    </div>
  );
};
