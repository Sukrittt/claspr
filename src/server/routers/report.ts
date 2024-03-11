import { createTRPCRouter } from "@/server/trpc";

import { reportIssue, updateReport, getReports } from "@/server/report/routes";

export const reportRouter = createTRPCRouter({
  reportIssue,
  updateReport,
  getReports,
});
