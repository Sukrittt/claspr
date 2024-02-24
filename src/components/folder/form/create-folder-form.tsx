import { z } from "zod";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
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
import { folderAtom } from "@/atoms";
import { MinifiedFolder } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateFolder } from "@/hooks/folder";

const folderCreationSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Folder name cannot be empty" }
    ),
});

type Inputs = z.infer<typeof folderCreationSchema>;

interface CreateFolderFormProps {
  closeModal: () => void;
  classroomId?: string;
  setActiveFolderId?: (folderId: string) => void;
}

export const CreateFolderForm: React.FC<CreateFolderFormProps> = ({
  closeModal,
  classroomId,
  setActiveFolderId,
}) => {
  const [, setFolders] = useAtom(folderAtom);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(folderCreationSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCleanUps = (folder: MinifiedFolder) => {
    closeModal();

    setActiveFolderId?.(folder.id);

    const updatedFolder = {
      ...folder,
      notes: [],
    };

    setFolders((prev) => [updatedFolder, ...prev]);
  };

  const { mutate: createFolder, isLoading } = useCreateFolder({
    handleCleanUps,
    classroomId,
  });

  function handleCreateFolder(data: Inputs) {
    createFolder({
      name: data.name,
      classroomId,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateFolder(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="folder-creation-form"
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
      <Button
        className="my-1 w-full"
        form="folder-creation-form"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Create Folder"
        )}
        <span className="sr-only">Create Folder</span>
      </Button>
    </div>
  );
};
