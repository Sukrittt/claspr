"use client";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ReportStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditReport } from "@/hooks/report";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";

const reportStatusUpdateSchema = z.object({
  reportStatus: z.nativeEnum(ReportStatus),
});

type Inputs = z.infer<typeof reportStatusUpdateSchema>;

interface ReportStatusFormProps {
  closeModal: () => void;
  reportId: string;
  reportStatus: ReportStatus | null;
}

export const ReportStatusForm: React.FC<ReportStatusFormProps> = ({
  closeModal,
  reportId,
  reportStatus,
}) => {
  const mounted = useMounted();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(reportStatusUpdateSchema),
    defaultValues: {
      reportStatus: reportStatus ?? "PENDING",
    },
  });

  const { mutate: updateReportStatus, isLoading } = useEditReport({
    closeModal,
  });

  function onSubmit(data: Inputs) {
    updateReportStatus({
      reportId,
      reportStatus: data.reportStatus,
    });
  }

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form
          id="issue-report-form"
          className="space-y-4"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="reportStatus"
            render={({ field }) => (
              <FormItem>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      {mounted ? (
                        <SelectValue placeholder="Select a report type" />
                      ) : (
                        <Skeleton className="h-4 w-28" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Button className="w-full" form="issue-report-form" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Save"
        )}
        <span className="sr-only">Save</span>
      </Button>
    </div>
  );
};
