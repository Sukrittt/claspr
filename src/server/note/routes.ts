import { z } from "zod";
import { NoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { getIsPartOfClassAuth } from "@/server/class/routes";

const NoteTypeEnum = z.nativeEnum(NoteType);

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
        createdAt: true,
      },
    });

    return note;
  });

/**
 * To edit a note.
 *
 * @param {object} input - The input parameters for editing a note.
 * @param {string} input.noteId - The id of the note.
 * @param {string} input.title - The updated title of the note.
 * @param {string} input.title - The updated emojiUrl of the note.
 */
export const editNote = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      title: z.string().max(200).optional(),
      emojiUrl: z.string().nullable().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { title, noteId, emojiUrl } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      select: {
        title: true,
        emojiUrl: true,
      },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    const updatedEmojiUrl = emojiUrl === null ? null : existingNote.emojiUrl;

    await db.note.update({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      data: {
        title: title ?? existingNote.title,
        emojiUrl: updatedEmojiUrl,
      },
    });
  });

/**
 * For updating the cover image of a note.
 *
 * @param {object} input - The input parameters for updating the cover image of a note.
 * @param {string} input.noteId - The id of the note.
 * @param {string} input.coverImage - An optional cover image of the note.
 * @param {string} input.gradientClass - An optional gradient class for the note.
 */
export const updateCover = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      coverImage: z.string().optional(),
      gradientClass: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { coverImage, noteId, gradientClass } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      select: { id: true },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    await db.note.update({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      data: {
        // There can exist only one of the property at a time.
        coverImage: coverImage ?? null,
        gradientClass: gradientClass ?? null,
      },
    });
  });

/**
 * To get the cover image of the note.
 *
 * @param {object} input - The input parameters for getting note cover image.
 * @param {string} input.noteId - The id of the note.
 */
export const getNoteCover = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { noteId } = input;

    const note = await db.note.findFirst({
      where: { id: noteId, creatorId: ctx.userId },
      select: { coverImage: true, gradientClass: true },
    });

    return { coverImage: note?.coverImage, gradientClass: note?.gradientClass };
  });

/**
 * To remove a note.
 *
 * @param {object} input - The input parameters for removing a note.
 * @param {string} input.noteId - The id of the note.
 */
export const removeNote = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { noteId } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    await db.note.delete({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
    });
  });

/**
 * To get a specific note.
 *
 * @param {object} input - The input parameters for getting a specific note.
 * @param {string} input.noteId - The id of the node.
 * @param {enum} input.noteType - The type of note to be fetched.
 * @param {enum} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object>} - A note object returned from the database.
 */
export const getNote = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      noteType: NoteTypeEnum,
      classroomId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { noteId, noteType, classroomId } = input;

    if (noteType === "CLASSROOM" && classroomId) {
      const isPartOfClass = await getIsPartOfClassAuth(classroomId, ctx.userId);

      if (!isPartOfClass) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not authorized to view this content in this classroom.",
        });
      }
    }

    const note = await db.note.findFirst({
      where: {
        id: noteId,
        noteType,
        classroomId,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return note;
  });

/**
 * To move a note to another folder.
 *
 * @param {object} input - The input parameters for moving a note to another folder.
 * @param {string} input.noteId - The id of the node.
 * @param {string} input.folderId - The id of the folder.
 */
export const moveNote = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      folderId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { noteId, folderId } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      select: { id: true },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    await db.note.update({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      data: {
        folderId,
      },
    });
  });

/**
 * To update the content of the note.
 *
 * @param {object} input - The input parameters for updating the content of the note.
 * @param {string} input.noteId - The id of the node.
 * @param {any} input.content - The content of the note.
 */
export const updateContent = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      content: z.any(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { noteId, content } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      select: { id: true },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    await db.note.update({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      data: {
        content,
      },
    });
  });
