import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

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
 * To edit the link of a media.
 *
 * @param {object} input - The input parameters for editing a media link.
 * @param {string} input.announcementId - The id of announcement where it belongs.
 * @param {string} input.mediaId - The id of the media to update.
 * @param {string} input.url - The updated url.
 * @param {string} input.label - The updated label.
 */
export const editLink = privateProcedure
  .input(
    z.object({
      mediaId: z.string(),
      announcementId: z.string(),
      url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/),
      label: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { mediaId, announcementId, url, label } = input;

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

    const existingMembership = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: existingAnnouncment.classRoomId,
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
        announcementId,
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

    await db.media.update({
      where: {
        id: mediaId,
        userId: ctx.userId,
      },
      data: {
        url,
        label,
      },
    });
  });

/**
 * To remove a media from an announcemnt.
 *
 * @param {object} input - The input parameters for removing a media.
 * @param {string} input.mediaId - The id of the media to remove.
 * @param {string} input.announcementId - The id of the announcement where the media belongs.
 */
export const removeMedia = privateProcedure
  .input(
    z.object({
      mediaId: z.string(),
      announcementId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { mediaId, announcementId } = input;

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

    const existingMembership = await db.membership.findFirst({
      where: {
        userId: ctx.userId,
        classRoomId: existingAnnouncment.classRoomId,
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
        announcementId,
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
      },
    });
  });
