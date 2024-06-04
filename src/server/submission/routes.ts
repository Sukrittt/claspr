import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { SubmissionStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { FilterType } from "@/types";
import { privateProcedure } from "@/server/trpc";
import { NovuEvent, novu } from "@/lib/novu";

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
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { assignmentId } = input;

    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: {
        classRoomId: true,
        classRoom: {
          select: {
            teacherId: true,
            title: true,
            teacher: { select: { name: true, email: true } },
          },
        },
        lateSubmission: true,
        dueDate: true,
      },
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

    if (assignment.classRoom.teacherId !== ctx.userId) {
      await novu.trigger(NovuEvent.SCRIBE, {
        to: {
          subscriberId: assignment.classRoom.teacherId,
          email: assignment.classRoom.teacher.email ?? "",
          firstName: assignment.classRoom.teacher.name ?? "",
        },
        payload: {
          message: `${ctx.username} submitted work for ${assignment.classRoom.title}`,
          url: `/c/${assignment.classRoomId}/a/${assignmentId}`,
        },
      });
    }

    const classMembers = await db.membership.findMany({
      where: {
        classRoomId: assignment.classRoomId,
        isTeacher: true,
      },
      select: {
        userId: true,
        user: { select: { email: true, name: true } },
      },
    });

    const promises = classMembers.map(async (member) => {
      if (member.userId !== ctx.userId) {
        return novu.trigger(NovuEvent.SCRIBE, {
          to: {
            subscriberId: member.userId,
            email: member.user.email ?? "",
            firstName: member.user.name ?? "",
          },
          payload: {
            message: `${ctx.username} submitted work for ${assignment.classRoom.title}`,
            url: `/c/${assignment.classRoomId}/a/${assignmentId}`,
          },
        });
      }
    });

    await Promise.all(promises);

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
      status: z.enum([
        "pending",
        "evaluated",
        "changes-requested",
        "not-submitted",
      ]),
    }),
  )
  .query(async ({ input }) => {
    const { assignmentId, status } = input;

    if (status === "not-submitted") return [];

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
    }),
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
 * To get all submissions made in a particular class.
 *
 * @param {object} input - The input parameters to get all submissions.
 * @param {string} input.classroomId - The id of the classroom.
 * @returns {Promise<Object[]>} - A list of submission objects from the database.
 */
export const getAllSubmissions = privateProcedure
  .input(
    z.object({
      classroomId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { classroomId } = input;

    const submissions = await db.submission.findMany({
      where: {
        assignment: {
          classRoomId: classroomId,
        },
        member: {
          userId: ctx.userId,
        },
      },
      select: {
        id: true,
        createdAt: true,
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
          },
        },
        media: {
          select: {
            id: true,
            url: true,
            mediaType: true,
            label: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return submissions;
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
    }),
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
    case "not-submitted":
      return "PENDING";
    case "changes-requested":
      return "CHANGES_REQUESTED";
    case "evaluated":
      return "APPROVED";
  }
};
