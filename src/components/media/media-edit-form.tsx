import { z } from "zod";
import { Media } from "@prisma/client";
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
import { useEditLink } from "@/hooks/media";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const linkSubmissionSchema = z.object({
  label: z.string().max(50).optional(),
  url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/, {
    message: "Please enter a valid link.",
  }),
});

type Inputs = z.infer<typeof linkSubmissionSchema>;

interface MediaEditFormProps {
  closeModal: () => void;
  media: Media;
}

export const MediaEditForm: React.FC<MediaEditFormProps> = ({
  closeModal,
  media,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(linkSubmissionSchema),
    defaultValues: {
      label: media.label ?? undefined,
      url: media.url,
    },
  });

  const { mutate: editLink } = useEditLink({ closeModal });

  function handleEditLink(data: Inputs) {
    editLink({
      ...data,
      mediaId: media.id,
      announcementId: media.announcementId,
    });
  }

  function onSubmit(data: Inputs) {
    handleEditLink(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="media-edit-form"
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
      <Button className="my-1 w-full" form="media-edit-form">
        Edit
        <span className="sr-only">Edit Link</span>
      </Button>
    </div>
  );
};
