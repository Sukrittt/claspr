"use client";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ReportType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReportIssue } from "@/hooks/report";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const reportContentInputSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(500)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Report content cannot be empty" }
    ),
  reportType: z.nativeEnum(ReportType),
});

type Inputs = z.infer<typeof reportContentInputSchema>;

export const ReportForm = ({ closeModal }: { closeModal: () => void }) => {
  const mounted = useMounted();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(reportContentInputSchema),
    defaultValues: {
      content: "",
      reportType: ReportType.BUG_REPORT,
    },
  });

  const cleanUp = () => {
    closeModal();
    form.reset();
  };

  const { mutate: reportIssue, isLoading } = useReportIssue({ cleanUp });

  function onSubmit(data: Inputs) {
    reportIssue({
      body: data.content,
      reportType: data.reportType,
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-[15px] font-semibold tracking-tight text-neutral-800">
          Report a bug
        </p>
        <Separator />
      </div>

      <Form {...form}>
        <form
          id="issue-report-form"
          className="space-y-4"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we help?</FormLabel>
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
                    <SelectItem value="BUG_REPORT">Report a Bug</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">
                      Request a feature
                    </SelectItem>
                    <SelectItem value="GENERAL">General Feedback</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    className="h-[120px]"
                    placeholder="Describe the issue in detail"
                    {...field}
                  />
                </FormControl>
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
          "Submit"
        )}
        <span className="sr-only">Submit Report</span>
      </Button>
    </div>
  );
};
