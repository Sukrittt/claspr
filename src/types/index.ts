import { ClassRoom, Member } from "@prisma/client";

export type ExtendedClassRoomsCreated = ClassRoom & {
  students: Member[];
};

export type ExtendedClassRoomsJoined = Member & {
  classRoom: ClassRoom;
};
