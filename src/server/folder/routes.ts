import { z } from "zod";
import { NoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

const NoteTypeEnum = z.nativeEnum(NoteType);

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
 * To create a new note.
 *
 * @param {object} input - The input parameters for creating a new note.
 * @param {string} input.title - The title of the note.
 * @param {string} input.folderId - The id of the folder.
 * @param {string} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object>} - Newly created note object from the database.
 */
export const createNote = privateProcedure
  .input(
    z.object({
      title: z.string().min(1).max(200),
      noteType: NoteTypeEnum,
      classroomId: z.string().optional(),
      folderId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { folderId, noteType, title, classroomId } = input;

    if (noteType === "CLASSROOM" && classroomId) {
      const isTeacherInClass = await getIsPartOfClassAuth(
        classroomId,
        ctx.userId,
        true
      );

      if (!isTeacherInClass) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not authorized to create content in this classroom.",
        });
      }
    }

    const note = await db.note.create({
      data: {
        creatorId: ctx.userId,
        folderId,
        title,
        classroomId,
        noteType,
      },
      select: {
        id: true,
        emojiUrl: true,
        title: true,
        folderId: true,
      },
    });

    return note;
  });
