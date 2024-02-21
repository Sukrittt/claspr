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
import { MinifiedNote } from "@/types";
import { useEditNote } from "@/hooks/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const folderUpdationSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Note title cannot be empty" }
    ),
});

type Inputs = z.infer<typeof folderUpdationSchema>;

interface EditNoteFormProps {
  closeModal: () => void;
  note: MinifiedNote;
  classroomId?: string;
}

export const EditNoteForm: React.FC<EditNoteFormProps> = ({
  closeModal,
  note,
  classroomId,
}) => {
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(folderUpdationSchema),
    defaultValues: {
      title: note.title,
    },
  });

  const { mutate: editNote } = useEditNote({
    closeModal,
    folderId: note.folderId,
    classroomId,
  });

  function handlelEditNote(data: Inputs) {
    editNote({
      ...data,
      noteId: note.id,
    });
  }

  function onSubmit(data: Inputs) {
    handlelEditNote(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="note-edit-form"
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
      <Button className="my-1 w-full" form="note-edit-form">
        Save
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
