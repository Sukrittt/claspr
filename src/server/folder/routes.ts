import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

/**
 * To get folders.
 *
 * @param {object} input - The input parameters for getting folders.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object[]>} - A list of folder objects from the database.
 */
export const getFolders = privateProcedure
  .input(
    z.object({
      classroomId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { classroomId } = input;

    let whereClause = {};

    if (classroomId) {
      whereClause = {
        classroomId,
      };
    } else {
      whereClause = {
        userId: ctx.userId,
      };
    }

    const folders = await db.folder.findMany({
      where: whereClause,
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
            classroomId: true,
            content: true,

            topics: {
              select: {
                id: true,
                name: true,
                noteId: true,
              },
              orderBy: {
                updatedAt: "desc",
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
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

    const nextOrder =
      userLastOrderFolder.length === 0 ? 1 : userLastOrderFolder[0].order + 1;

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
      select: { order: true },
    });

    if (!existingFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We coudln't find the folder you are looking for.",
      });
    }

    const deletedFolderOrder = existingFolder.order;

    const promises = [
      db.folder.delete({
        where: {
          id: folderId,
          userId: ctx.userId,
        },
      }),
      db.folder.updateMany({
        where: {
          order: { gt: deletedFolderOrder },
          userId: ctx.userId,
        },
        data: {
          order: { decrement: 1 },
        },
      }),
    ];

    await Promise.all(promises);
  });

/**
 * To reorder a folder.
 *
 * @param {object} input - The input parameters for reordering a folder.
 * @param {string} input.activeFolderId - The id of the folder which is being dragged.
 * @param {string} input.overFolderId - The id of the folder where it was dropped.
 * @param {enum} input.shiftDirection - The direction in which the shifting should happen.
 */
export const reorderFolder = privateProcedure
  .input(
    z.object({
      activeFolderId: z.string(),
      overFolderId: z.string(),
      shiftFolders: z.array(
        z.object({
          folderId: z.string(),
          order: z.number(),
        })
      ),
      shiftDirection: z.enum(["UP", "DOWN"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { activeFolderId, shiftFolders, shiftDirection, overFolderId } =
      input;

    const activeOrderFolder = await db.folder.findFirst({
      where: {
        id: activeFolderId,
        userId: ctx.userId,
      },
      select: { id: true },
    });

    if (!activeOrderFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Folder you are trying to move was not found.",
      });
    }

    const existingOverFolder = await db.folder.findFirst({
      where: {
        id: overFolderId,
        userId: ctx.userId,
      },
      select: { id: true, order: true },
    });

    if (!existingOverFolder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Folder you are trying to move was not found.",
      });
    }

    // NOTE: I'm not using Promise.all because of the order of execution

    //update the order of the active folder
    await db.folder.update({
      where: {
        id: activeFolderId,
        userId: ctx.userId,
      },
      data: {
        order: existingOverFolder.order,
      },
    });

    if (shiftFolders.length > 0) {
      //shifting the order of the folders in between
      const shiftUpdatePromise = shiftFolders.map(
        async ({ folderId, order }) => {
          return db.folder.update({
            where: {
              id: folderId,
              userId: ctx.userId,
            },
            data: {
              order: shiftDirection === "UP" ? order + 1 : order - 1,
            },
          });
        }
      );

      await Promise.all(shiftUpdatePromise);
    }
  });
