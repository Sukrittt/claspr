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
        classroomId: true,
        content: true,
        viewCount: true,

        topics: {
          select: {
            id: true,
            name: true,
            noteId: true,
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
    });

    return note;
  });

/**
 * To edit a note.
 *
 * @param {object} input - The input parameters for editing a note.
 * @param {string} input.noteId - The id of the note.
 * @param {string} input.title - The updated title of the note.
 * @param {string} input.emojiUrl - The updated emojiUrl of the note.
 * @param {string} input.classroomId - The updated classroom to be linked with this note.
 */
export const editNote = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      title: z.string().max(200).optional(),
      emojiUrl: z.string().nullable().optional(),
      classroomId: z.string().optional().nullable(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { title, noteId, emojiUrl, classroomId } = input;

    const existingNote = await db.note.findFirst({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      select: {
        title: true,
        emojiUrl: true,
        classroomId: true,
      },
    });

    if (!existingNote) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    const fallbackEmojiUrl = emojiUrl === null ? null : existingNote.emojiUrl;
    const fallBackUpdatedClassroomId =
      classroomId === null ? null : existingNote.classroomId;

    await db.note.update({
      where: {
        id: noteId,
        creatorId: ctx.userId,
      },
      data: {
        title: title ?? existingNote.title,
        emojiUrl: emojiUrl ?? fallbackEmojiUrl,
        classroomId: classroomId ?? fallBackUpdatedClassroomId,
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
        topics: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        classroom: {
          select: {
            title: true,
          },
        },
      },
    });

    return note;
  });

/**
 * To get a list of notes by it's title
 *
 * @param {object} input - The input parameters for getting notes by it's title.
 * @param {enum} input.title - The title of the note to be fetched.
 * @param {enum} input.noteType - The type of note to be fetched.
 * @param {enum} input.classroomId - An optional id of the classroom.
 * @returns {Promise<Object>} - A list of note object returned from the database.
 */
export const getNoteByTitle = privateProcedure
  .input(
    z.object({
      title: z.string(),
      noteType: NoteTypeEnum,
      classroomId: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { title, noteType, classroomId } = input;

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

    const notes = await db.note.findMany({
      where: {
        classroomId,
        OR: [
          {
            title: {
              contains: title,
              mode: "insensitive",
            },
          },
          {
            topics: {
              some: {
                name: {
                  contains: title,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        emojiUrl: true,
      },
    });

    return notes;
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

/**
 * To attach topics to a specific note.
 *
 * @param {object} input - The input parameters for attaching topics to a specific note.
 * @param {string} input.noteId - The id of the node.
 * @param {string[]} input.topics - An array of topic names for the note.
 */
export const attachTopics = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      topics: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { noteId, topics } = input;

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

    const topicRecords = topics.map((name) => ({
      name,
      noteId,
    }));

    await db.topic.createMany({
      data: topicRecords,
    });
  });

/**
 * To remove topics of a specific note.
 *
 * @param {object} input - The input parameters for removing topics of a specific note.
 * @param {string} input.noteId - The id of the node.
 * @param {string[]} input.topicIds - An array of topic ids.
 */
export const removeTopics = privateProcedure
  .input(
    z.object({
      noteId: z.string(),
      topicIds: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { noteId, topicIds } = input;

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

    await db.topic.deleteMany({
      where: {
        noteId,
        id: {
          in: topicIds,
        },
      },
    });
  });

/**
 * To update the view count for the note.
 *
 * @param {object} input - The input parameters for updating the view count for the note.
 * @param {string} input.noteId - The id of the node.
 */
export const updateViewCount = privateProcedure
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
      },
      select: { noteType: true, classroomId: true, viewCount: true },
    });

    if (!existingNote || existingNote.noteType === "PERSONAL") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "We couldn't find the note you are looking for.",
      });
    }

    const isTeacher = await getIsPartOfClassAuth(
      existingNote.classroomId!, //When note type is not PERSONAL, classroomId WILL be defined.
      ctx.userId,
      true
    );

    if (isTeacher) return;

    await db.note.update({
      where: {
        id: noteId,
      },
      data: {
        viewCount: existingNote.viewCount ? existingNote.viewCount + 1 : 1,
      },
    });
  });
