import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { isBefore } from "date-fns";
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
import { ExtendedEvent } from "@/types";
import { useEditEvent } from "@/hooks/event";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

const eventUpdationSchema = z.object({
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
  description: z.string().max(500).optional().nullable(),
});

type Inputs = z.infer<typeof eventUpdationSchema>;

interface EditEventFormProps {
  closeModal: () => void;
  event: ExtendedEvent;
}

export const EditEventForm: React.FC<EditEventFormProps> = ({
  closeModal,
  event,
}) => {
  const [eventDate, setEventDate] = useState<Date | undefined>(event.eventDate);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(eventUpdationSchema),
    defaultValues: {
      title: event.title,
    },
  });

  const { mutate: editEvent } = useEditEvent({
    closeModal,
  });

  function handlelEditEvent(data: Inputs) {
    if (!eventDate) {
      toast.error("Please select a date for the event");
      return;
    }

    if (isBefore(eventDate, new Date())) {
      toast.error("Event date has already passed. Please select a future date");
      return;
    }

    editEvent({
      ...data,
      eventId: event.id,
      eventDate: eventDate,
    });
  }

  function onSubmit(data: Inputs) {
    handlelEditEvent(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="event-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
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
                    disabled={[{ before: new Date() }, new Date()]}
                    disableTimePicker
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="my-1 w-full" form="event-edit-form">
        Save
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
