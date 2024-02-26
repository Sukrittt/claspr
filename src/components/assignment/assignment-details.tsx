import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExtendedAssignmentDetails } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { useEditAssignmentDetails } from "@/hooks/assignment";

interface AssignmentDetailsProps {
  assignment: ExtendedAssignmentDetails;
}

const editAssignmentSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Assignment title cannot be empty" }
    ),
});

type Inputs = z.infer<typeof editAssignmentSchema>;

export const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  assignment,
}) => {
  const [allowLateSubmission, setAllowLateSubmission] = useState(
    assignment.lateSubmission ?? false
  );
  const [date, setDate] = useState<Date | undefined>(assignment.dueDate);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(editAssignmentSchema),
    defaultValues: {
      title: assignment.title,
    },
  });

  const { mutate: editAssignment, isLoading } = useEditAssignmentDetails();

  function onSubmit(data: Inputs) {
    if (!date) {
      toast.error("Please select a due date for the assignment");
      return;
    }

    editAssignment({
      assignmentId: assignment.id,
      classroomId: assignment.classRoomId,
      title: data.title,
      dueDate: date,
      lateSubmission: allowLateSubmission,
    });
  }

  return (
    <div className="flex flex-col gap-y-4 pt-2">
      <div>
        <h3 className="font-semibold text-lg tracking-tight">
          Assignment Details
        </h3>
        <p className="text-muted-foreground text-sm">
          Edit details of this assignment.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form
          id="assignment-edit-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="E.g: Data Structures Assignment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-1">
        <Label className="text-sm tracking-tight leading-none font-medium">
          Due date
        </Label>

        <DatePicker
          value={date}
          setValue={setDate}
          disabled={[{ before: new Date() }]}
          placeholder="Pick a date for submission"
          className="-left-32"
        />
      </div>

      <div className="flex items-center justify-end gap-x-2">
        <Checkbox
          id="late-submission"
          disabled={isLoading}
          checked={allowLateSubmission}
          onCheckedChange={(val) => setAllowLateSubmission(val as boolean)}
        />
        <label
          htmlFor="late-submission"
          className="text-sm tracking-tight text-gray-800 cursor-pointer"
        >
          Allow late submission?
        </label>
      </div>

      <Button
        form="assignment-edit-form"
        className="w-fit"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-3 w-[22px] animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
