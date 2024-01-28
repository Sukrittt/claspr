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
      select: { classRoomId: true },
    });

    if (!announcement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the announcement you're looking for.",
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
 * Creates a new media for a submission.
 *
 * @param {object} input - The input parameters for creating a media for a submission.
 * @param {string} input.announcementId - The id of the announcement.
 * @param {string[]} input.media - An array of media objects containing the url and label.
 * @param {enum} input.mediaType - An enum for describing the type of media.
 */
export const createMedia = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
      media: z.array(
        z.object({
          label: z.string().optional(),
          url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/),
        })
      ),
      mediaType: z.enum(["LINK", "DOCUMENT"]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { announcementId, media, mediaType } = input;

    const announcement = await db.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the announcement you're looking for.",
      });
    }

    if (announcement.creatorId === ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Teachers cannot submit media for their own announcements.",
      });
    }

    await db.media.createMany({
      data: media.map((media) => ({
        announcementId,
        label: media.label,
        url: media.url,
        mediaType,
        userId: ctx.userId,
      })),
    });
  });

/**
 * To get the media uploaded by the user for a particular submission.
 *
 * @param {object} input - The input parameters for getting uploaded media.
 * @param {string} input.announcementId - The id of the announcement.
 * @returns {Promise<Object[]>} - A list of media objects from the database.
 */
export const getUploadedMedia = privateProcedure
  .input(
    z.object({
      announcementId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const media = await db.media.findMany({
      where: {
        announcementId: input.announcementId,
        userId: ctx.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return media;
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
