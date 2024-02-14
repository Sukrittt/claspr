import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

/**
 * To get the folders created by the user.
 *
 * @returns {Promise<Object[]>} - A list of folder objects from the database.
 */
export const getFolders = privateProcedure.query(async ({ ctx }) => {
  const folders = await db.folder.findMany({
    where: {
      userId: ctx.userId,
      classroomId: null,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      order: true,
      notes: {
        select: {
          id: true,
          folderId: true,
          title: true,
          emojiUrl: true,
          createdAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
    orderBy: {
      order: "desc",
    },
  });

  return folders;
});

/**
 * To create a new folder.
 *
 * @param {object} input - The input parameters for creating a new folder.
 * @param {string} input.name - The name of the folder.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object>} - Newly created folder object from the database.
 */
export const createFolder = privateProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      classroomId: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { name, classroomId } = input;

    if (classroomId) {
      const isPartOfClass = await getIsPartOfClassAuth(classroomId, ctx.userId);

      if (!isPartOfClass) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not authorized to view the content of this classroom.",
        });
      }
    }

    const userLastOrderFolder = await db.folder.findMany({
      where: {
        userId: ctx.userId,
        classroomId: null,
      },
      select: {
        order: true,
      },
      orderBy: {
        order: "desc",
      },
      take: 1,
    });

    const nextOrder = userLastOrderFolder[0].order + 1;

    const folder = await db.folder.create({
      data: {
        name,
        userId: ctx.userId,
        order: nextOrder,
        classroomId,
      },
      select: {
        id: true,
        name: true,
        order: true,
        createdAt: true,
      },
    });

    return folder;
  });

/**
 * To edit a folder.
 *
 * @param {object} input - The input parameters for editing a folder.
 * @param {string} input.folderId - The id of the folder.
 * @param {string} input.name - The updated name of the folder.
 */
export const editFolder = privateProcedure
  .input(
    z.object({
      folderId: z.string(),
      name: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { folderId, name } = input;

    const existingFolder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId: ctx.userId,
      },
    });

    if (!existingFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We coudln't find the folder you are looking for.",
      });
    }

    await db.folder.update({
      where: {
        id: folderId,
        userId: ctx.userId,
      },
      data: {
        name,
      },
    });
  });

/**
 * To remove a folder.
 *
 * @param {object} input - The input parameters for removing a folder.
 * @param {string} input.folderId - The id of the folder.
 */
export const removeFolder = privateProcedure
  .input(
    z.object({
      folderId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { folderId } = input;

    const existingFolder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId: ctx.userId,
      },
    });

    if (!existingFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We coudln't find the folder you are looking for.",
      });
    }

    await db.folder.delete({
      where: {
        id: folderId,
        userId: ctx.userId,
      },
    });
  });
