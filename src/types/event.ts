import { Assignment, Event } from "@prisma/client";
import { MinifiedUser } from ".";

export type MinifiedEvent = Pick<
  Event,
  "id" | "title" | "eventDate" | "description" | "createdAt"
>;

export type ExtendedEvent = MinifiedEvent & {
  user: MinifiedUser;
  assignment: Pick<Assignment, "id" | "title" | "classRoomId"> | null;
};
