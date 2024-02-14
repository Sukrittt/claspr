import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useEditFolder } from "@/hooks/folder";

const folderUpdationSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Folder name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof folderUpdationSchema>;

interface EditFolderFormProps {
  closeModal: () => void;
  folderId: string;
  folderName: string;
}

export const FolderEditForm: React.FC<EditFolderFormProps> = ({
  closeModal,
  folderId,
  folderName,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(folderUpdationSchema),
    defaultValues: {
      name: folderName,
    },
  });

  const { mutate: editFolder } = useEditFolder({
    closeModal,
  });

  function handlelEditFolder(data: Inputs) {
    editFolder({
      folderId,
      name: data.name,
    });
  }

  function onSubmit(data: Inputs) {
    handlelEditFolder(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="folder-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="E.g: Maths" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="my-1 w-full" form="folder-edit-form">
        Save
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
