import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { startOfDay } from "date-fns";
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
    .max(200)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Event name cannot be empty" },
    ),
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
    date: startOfDay(event.eventDate),
  });

  function handlelEditEvent(data: Inputs) {
    if (!eventDate) {
      toast.error("Please select a date for the event");
      return;
    }

    editEvent({
      ...data,
      eventId: event.id,
      eventDate,
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
                    className="-left-[260px] sm:-left-40"
                    value={eventDate}
                    setValue={setEventDate}
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
