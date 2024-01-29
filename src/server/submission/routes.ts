import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * Creates a new submission for an assignment.
 *
 * @param {object} input - The input parameters for creating a new submission.
 * @param {string} input.announcementId - The id of the announcement.
 */
export const createSubmission = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { announcementId } = input;

    const announcement = await db.announcement.findUnique({
      where: {
        id: announcementId,
      },
      select: { classRoomId: true, lateSubmission: true, dueDate: true },
    });

    if (!announcement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the announcement you're looking for.",
      });
    }

    if (!announcement.lateSubmission && announcement.dueDate < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The due date for this assignment has passed.",
      });
    }

    const member = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: announcement.classRoomId,
      },
      select: { id: true },
    });

    if (!member) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be a member of the class to submit.",
      });
    }

    const existingSubmission = await db.submission.findFirst({
      where: {
        announcementId,
        memberId: member.id,
      },
      select: { id: true },
    });

    if (existingSubmission) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You have already submitted your work for this assignment.",
      });
    }

    const media = await db.media.findFirst({
      where: {
        announcementId,
        userId: ctx.userId,
      },
    });

    if (!media) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You need to upload at least one media to submit.",
      });
    }

    const submission = await db.submission.create({
      data: {
        announcementId,
        memberId: member.id,
      },
    });

    await db.media.updateMany({
      where: {
        announcementId,
        userId: ctx.userId,
      },
      data: {
        submissionId: submission.id,
      },
    });
  });

/**
 * To get submission details for a particular submission
 *
 * @param {object} input - The input parameters to get submission details.
 * @param {string} input.announcementId - The id of the announcement.
 * @returns {Promise<Object>} - A submission object from the database.
 */
export const getSubmission = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { announcementId } = input;

    const submission = await db.submission.findFirst({
      where: {
        announcementId,
        member: {
          userId: ctx.userId,
        },
      },
    });

    return submission;
  });

/**
 * To unsubmit a submission.
 *
 * @param {object} input - The input parameters for unsubmitting a submission.
 * @param {string} input.announcementId - The id of the announcement.
 * @param {string} input.submissionId - The id of the submission to update.
 */
export const unsubmit = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
      submissionId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { announcementId, submissionId } = input;

    const existingAnnouncment = await db.announcement.findFirst({
      where: {
        id: announcementId,
      },
    });

    if (!existingAnnouncment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the announcement you're looking for.",
      });
    }

    const existingSubmission = await db.submission.findFirst({
      where: {
        id: submissionId,
        announcementId,
      },
    });

    if (!existingSubmission) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "You have not submitted your work for this assignment.",
      });
    }

    await db.submission.delete({
      where: {
        id: submissionId,
        announcementId,
      },
    });
  });
