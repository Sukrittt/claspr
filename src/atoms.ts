import { atom } from "jotai";

import {
  ExtendedFolder,
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";

export const createdClassSections = atom<ExtendedSectionWithClassrooms[]>([]);
export const joinedClassSections = atom<ExtendedSectionWithMemberships[]>([]);

export const isCloseAllCreationToggle = atom<boolean | null>(null);
export const isCloseAllMembershipToggle = atom<boolean | null>(null);

export const isSubmittingAtom = atom<boolean | undefined>(undefined);
export const contentAtom = atom<undefined | any>(undefined);

export const isChangingQueryAtom = atom(false);

export const folderAtom = atom<ExtendedFolder[]>([]);
export const activeFolderIdAtom = atom<string | null>(null);
