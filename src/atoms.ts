import { atom } from "jotai";

import {
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
  SubmissionAtomType,
} from "@/types";

export const createdClassSections = atom<ExtendedSectionWithClassrooms[]>([]);
export const joinedClassSections = atom<ExtendedSectionWithMemberships[]>([]);

export const isCloseAllCreationToggle = atom<boolean | null>(null);
export const isCloseAllMembershipToggle = atom<boolean | null>(null);

export const descriptionAtom = atom<string | null>(null);

export const isSubmittingAtom = atom<boolean | undefined>(undefined);
export const contentAtom = atom<undefined | any>(undefined);

export const linkAtom = atom<SubmissionAtomType[]>([]);
export const documentAtom = atom<SubmissionAtomType[]>([]);
