import { z } from "zod";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { NoteType } from "@prisma/client";
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
import { MinifiedNote } from "@/types";
import { useCreateNote } from "@/hooks/note";
import { MinifiedTopic } from "@/types/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const noteCreationSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Note title cannot be empty" }
    ),
});

type Inputs = z.infer<typeof noteCreationSchema>;

interface CreateNoteFormProps {
  folderId: string;
  closeModal: () => void;
  classroomId?: string;
  noteType: NoteType;
}

export const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
  closeModal,
  classroomId,
  noteType,
  folderId,
}) => {
  const [folders, setFolders] = useAtom(folderAtom);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(noteCreationSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleCleanUps = (
    note: MinifiedNote & {
      topics: MinifiedTopic[];
    }
  ) => {
    closeModal();

    const folderToUpdate = folders.find(
      (folder) => folder.id === note.folderId
    );

    if (!folderToUpdate) return;

    const updatedFolder = {
      ...folderToUpdate,
      notes: [note, ...folderToUpdate.notes],
    };

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === updatedFolder.id ? updatedFolder : folder
      )
    );
  };

  const { mutate: createNote, isLoading } = useCreateNote({
    handleCleanUps,
    classroomId,
  });

  function handleCreateNote(data: Inputs) {
    createNote({
      ...data,
      noteType,
      classroomId,
      folderId,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateNote(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="note-creation-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.g: Number Theory: Chapter One"
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
        className="my-1 w-full"
        form="note-creation-form"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Create Note"
        )}
        <span className="sr-only">Create Note</span>
      </Button>
    </div>
  );
};
