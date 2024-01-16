import { atom } from "jotai";

import {
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";

export const createdClassSections = atom<ExtendedSectionWithClassrooms[]>([]);
export const joinedClassSections = atom<ExtendedSectionWithMemberships[]>([]);

export const isCloseAllCreationToggle = atom<boolean | null>(null);
export const isCloseAllMembershipToggle = atom<boolean | null>(null);
