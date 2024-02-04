import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

/**
 * Creates a new media for a submission.
 *
 * @param {object} input - The input parameters for creating a media for a submission.
 * @param {string} input.assignmentId - The id of the assignment.
 * @param {string[]} input.media - An array of media objects containing the url and label.
 * @param {enum} input.mediaType - An enum for describing the type of media.
 */
export const createMedia = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
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
    const { assignmentId, media, mediaType } = input;

    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the assignment you're looking for.",
      });
    }

    if (assignment.creatorId === ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Teachers cannot submit media for their own assignment.",
      });
    }

    await db.media.createMany({
      data: media.map((media) => ({
        assignmentId,
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
 * @param {string} input.assignmentId - The id of the assignment.
 * @returns {Promise<Object[]>} - A list of media objects from the database.
 */
export const getUploadedMedia = privateProcedure
  .input(
    z.object({
      assignmentId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const media = await db.media.findMany({
      where: {
        assignmentId: input.assignmentId,
        userId: ctx.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return media;
  });

/**
 * To edit the link of a media.
 *
 * @param {object} input - The input parameters for editing a media link.
 * @param {string} input.assignmentId - The id of assignment where it belongs.
 * @param {string} input.mediaId - The id of the media to update.
 * @param {string} input.url - The updated url.
 * @param {string} input.label - The updated label.
 */
export const editLink = privateProcedure
  .input(
    z.object({
      mediaId: z.string(),
      assignmentId: z.string(),
      url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/),
      label: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { mediaId, assignmentId, url, label } = input;

    const existingAssignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
      },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the assignment you're looking for.",
      });
    }

    const existingMembership = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: existingAssignment.classRoomId,
      },
    });

    if (!existingMembership) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be a member of this class to submit.",
      });
    }

    const existingSubmission = await db.submission.findFirst({
      where: {
        assignmentId,
        memberId: existingMembership.id,
      },
    });

    if (existingSubmission) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "You have already submitted your work for this assignment. Please unsubmit to edit your work.",
      });
    }

    const existingMedia = await db.media.findFirst({
      where: {
        id: mediaId,
        userId: ctx.userId,
      },
    });

    if (!existingMedia) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the media you're looking for.",
      });
    }

    if (existingMedia.mediaType === "DOCUMENT") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "You cannot edit this media. Please remove it and upload a new one.",
      });
    }

    await db.media.update({
      where: {
        id: mediaId,
        userId: ctx.userId,
        assignmentId,
      },
      data: {
        url,
        label,
      },
    });
  });

/**
 * To remove a media from an assignment.
 *
 * @param {object} input - The input parameters for removing a media.
 * @param {string} input.mediaId - The id of the media to remove.
 * @param {string} input.assignmentId - The id of the assignment where the media belongs.
 */
export const removeMedia = privateProcedure
  .input(
    z.object({
      mediaId: z.string(),
      assignmentId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { mediaId, assignmentId } = input;

    const existingAssignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
      },
    });

    if (!existingAssignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the assignment you're looking for.",
      });
    }

    const existingMembership = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: existingAssignment.classRoomId,
      },
    });

    if (!existingMembership) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be a member of this class to submit.",
      });
    }

    const existingSubmission = await db.submission.findFirst({
      where: {
        assignmentId,
        memberId: existingMembership.id,
      },
    });

    if (existingSubmission) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "You have already submitted your work for this assignment. Please unsubmit to edit your work.",
      });
    }

    const existingMedia = await db.media.findFirst({
      where: {
        id: mediaId,
        userId: ctx.userId,
      },
    });

    if (!existingMedia) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the media you're looking for.",
      });
    }

    await db.media.delete({
      where: {
        id: mediaId,
        userId: ctx.userId,
        assignmentId,
      },
    });
  });
