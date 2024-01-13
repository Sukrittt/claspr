import { atom } from "jotai";

import { ExtendedClassRoomsCreated, ExtendedClassRoomsJoined } from "./types";

export const classesCreatedAtom = atom<ExtendedClassRoomsCreated[]>([]);
export const classesJoinedAtom = atom<ExtendedClassRoomsJoined[]>([]);
