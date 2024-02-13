import { Section } from "@prisma/client";

import { ExtendedMembership, MinifiedClassroom } from ".";

export type MinifiedSection = Omit<
  Section,
  "creatorId" | "createdAt" | "updatedAt"
>;

export type ExtendedSectionWithClassrooms = MinifiedSection & {
  classrooms: MinifiedClassroom[];
};

export type ExtendedSectionWithMemberships = MinifiedSection & {
  memberships: ExtendedMembership[];
};
