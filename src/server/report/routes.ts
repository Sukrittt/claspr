import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ReportStatus, ReportType } from "@prisma/client";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

const ReportTypeEnum = z.nativeEnum(ReportType);
const ReportStatusEnum = z.nativeEnum(ReportStatus);

/**
 * To report an issue.
 *
 * @param {object} input - The input parameters for reporting an issue.
 * @param {enum} input.reportType - The type of the report.
 * @param {string} input.body - The body content of the report.
 */
export const reportIssue = privateProcedure
  .input(
    z.object({
      reportType: ReportTypeEnum,
      body: z.string().min(1).max(500),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { body, reportType } = input;

    await db.report.create({
      data: {
        body,
        reportType,
        userId: ctx.userId,
      },
    });
  });

/**
 * To update the status of a report.
 *
 * @param {object} input - The input parameters for updating the status of the report.
 * @param {enum} input.reportId - The id of the report.
 * @param {enum} input.reportStatus - The updated status of the report.
 */
export const updateReport = privateProcedure
  .input(
    z.object({
      reportId: z.string(),
      reportStatus: ReportStatusEnum,
    })
  )
  .mutation(async ({ input }) => {
    const { reportId, reportStatus } = input;

    const existingReport = await db.report.findFirst({
      where: {
        id: reportId,
      },
      select: {
        reportStatus: true,
      },
    });

    if (!existingReport) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the report you are looking for. Please try again later.",
      });
    }

    // If the report status is already the same, then we don't need to update it.
    if (existingReport.reportStatus === reportStatus) return;

    await db.report.update({
      where: {
        id: reportId,
      },
      data: {
        reportStatus,
      },
    });
  });

/**
 * To delete a report.
 *
 * @param {object} input - The input parameters for deleting a report.
 * @param {enum} input.reportId - The id of the report.
 */
export const removeReport = privateProcedure
  .input(
    z.object({
      reportId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { reportId } = input;

    const existingReport = await db.report.findFirst({
      where: {
        id: reportId,
      },
      select: { id: true },
    });

    if (!existingReport) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "We couldn't find the report you are looking for. Please try again later.",
      });
    }

    await db.report.delete({
      where: {
        id: reportId,
      },
    });
  });

/**
 * To get app reports.
 *
 * @param {object} input - The input parameters for getting reports.
 * @return {object} - A list of report objects.
 */
export const getReports = privateProcedure
  .input(
    z.object({
      reportStatus: ReportStatusEnum.optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { reportStatus } = input;

    if (ctx.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource.",
      });
    }

    const reports = await db.report.findMany({
      where: {
        reportStatus,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        body: true,
        reportType: true,
        reportStatus: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return reports;
  });
