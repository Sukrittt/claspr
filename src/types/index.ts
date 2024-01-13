import { ClassRoom, Member, User } from "@prisma/client";

export type ExtendedClassRoomsCreated = ClassRoom & {
  students: Member[];
  teacher: User;
};

export type ExtendedClassRoomsJoined = {
  classRoom: ClassRoom;
} & Member;
