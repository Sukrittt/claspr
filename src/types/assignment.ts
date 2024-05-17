import {
  Assignment,
  ClassRoom,
  Media,
  Membership,
  Submission,
} from "@prisma/client";

import { ExtendedMembershipDetails, MinifiedUser } from ".";

type MinifiedAssignment = Pick<
  Assignment,
  "id" | "title" | "createdAt" | "dueDate" | "classRoomId" | "updatedAt"
>;

type DetailedAssignment = Pick<
  Assignment,
  | "id"
  | "title"
  | "createdAt"
  | "dueDate"
  | "classRoomId"
  | "description"
  | "updatedAt"
  | "lateSubmission"
>;

export type ExtendedAssignmentDetails = DetailedAssignment & {
  creator: MinifiedUser;
  classRoom: Pick<ClassRoom, "id" | "title" | "description">;
  submissions: (Submission & {
    member: Pick<Membership, "userId">;
  })[];
};

export type ExtendedAssignment = MinifiedAssignment & {
  creator: MinifiedUser;
  classRoom: Pick<ClassRoom, "id" | "title" | "description">;
  submissions: (Submission & {
    member: Pick<Membership, "userId">;
  })[];
};

export type ExtendedSubmission = Submission & {
  member: ExtendedMembershipDetails;
  media: Media[];
};

export type FilterType =
  | "pending"
  | "evaluated"
  | "changes-requested"
  | "not-submitted";
