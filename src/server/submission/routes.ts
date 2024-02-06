import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { SubmissionStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { FilterType } from "@/types";
import { privateProcedure } from "@/server/trpc";

/**
 * Creates a new submission for an assignment.
 *
 * @param {object} input - The input parameters for creating a new submission.
 * @param {string} input.assignmentId - The id of the assignment.
 */
export const createSubmission = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { assignmentId } = input;

    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: { classRoomId: true, lateSubmission: true, dueDate: true },
    });

    if (!assignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the assignment you're looking for.",
      });
    }

    if (!assignment.lateSubmission && assignment.dueDate < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The due date for this assignment has passed.",
      });
    }

    const member = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: assignment.classRoomId,
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
        assignmentId,
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
        assignmentId,
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
        assignmentId,
        memberId: member.id,
      },
    });

    await db.media.updateMany({
      where: {
        assignmentId,
        userId: ctx.userId,
      },
      data: {
        submissionId: submission.id,
      },
    });
  });

/**
 * To get all submissions for a particular assignment.
 *
 * @param {object} input - The input parameters to get assignment submissions.
 * @param {string} input.assignmentId - The id of the assignment.
 * @returns {Promise<Object>} - A list of submission objects from the database.
 */
export const getAssignmentSubmissions = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      status: z.enum(["pending", "evaluated", "changes-requested"]),
    })
  )
  .query(async ({ input }) => {
    const { assignmentId, status } = input;

    const submissionStatus = getSubmissionStatus(status);

    const submissions = await db.submission.findMany({
      where: {
        assignmentId,
        submissionStatus,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
        media: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return submissions;
  });

/**
 * To get details for a particular submission
 *
 * @param {object} input - The input parameters to get submission details.
 * @param {string} input.assignmentId - The id of the assignment.
 * @returns {Promise<Object>} - A submission object from the database.
 */
export const getSubmission = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { assignmentId } = input;

    const submission = await db.submission.findFirst({
      where: {
        assignmentId,
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
 * @param {string} input.assignmentId - The id of the assignment.
 * @param {string} input.submissionId - The id of the submission to update.
 */
export const unsubmit = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
      submissionId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { assignmentId, submissionId } = input;

    const existingAnnouncment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
      },
    });

    if (!existingAnnouncment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the assignment you're looking for.",
      });
    }

    const existingSubmission = await db.submission.findFirst({
      where: {
        id: submissionId,
        assignmentId,
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
        assignmentId,
      },
    });
  });

const getSubmissionStatus = (status: FilterType): SubmissionStatus => {
  switch (status) {
    case "pending":
      return "PENDING";
    case "changes-requested":
      return "CHANGES_REQUESTED";
    case "evaluated":
      return "APPROVED";
  }
};
