import { Assignment, Event } from "@prisma/client";

export type MinifiedEvent = Pick<
  Event,
  "id" | "title" | "eventDate" | "description" | "createdAt" | "userId"
>;

export type ExtendedEvent = MinifiedEvent & {
  assignment: Pick<
    Assignment,
    "id" | "title" | "classRoomId" | "description"
  > | null;
};
