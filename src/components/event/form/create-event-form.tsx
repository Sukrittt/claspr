import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { isBefore } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { useCreateEvent } from "@/hooks/event";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

const eventCreationSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Event name cannot be empty" }
    ),
  description: z.string().max(500).optional(),
});

type Inputs = z.infer<typeof eventCreationSchema>;

interface CreateEventFormProps {
  closeModal: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  closeModal,
}) => {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createEvent, isLoading } = useCreateEvent({ closeModal });

  function handleCreateEvent(data: Inputs) {
    if (!eventDate) {
      toast.error("Please select a date for the event");
      return;
    }

    if (isBefore(eventDate, new Date())) {
      toast.error("Event date cannot be set to past date.");
      return;
    }

    createEvent({
      ...data,
      eventDate,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateEvent(data);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          id="event-creation-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="E.g: Prepare for maths exam"
                      {...field}
                    />
                  </FormControl>
                  <DatePicker
                    value={eventDate}
                    setValue={setEventDate}
                    disabled={[{ before: new Date() }]}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button
        className="my-1 w-full"
        form="event-creation-form"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Create Event"
        )}
        <span className="sr-only">Create Event</span>
      </Button>
    </div>
  );
};
