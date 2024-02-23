import { atom } from "jotai";

import {
  ExtendedFolder,
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";
import { DiscussionTab } from "./components/discussions/discussion-tabs";

export const createdClassSections = atom<ExtendedSectionWithClassrooms[]>([]);
export const joinedClassSections = atom<ExtendedSectionWithMemberships[]>([]);

export const isCloseAllCreationToggle = atom<boolean | null>(null);
export const isCloseAllMembershipToggle = atom<boolean | null>(null);

export const isSubmittingAtom = atom<boolean | undefined>(undefined);
export const contentAtom = atom<undefined | any>(undefined);

//For Dashboard
export const folderAtom = atom<ExtendedFolder[]>([]);
export const activeFolderIdAtom = atom<string | null>(null);

// For Classroom
export const globalLoaderAtom = atom(false);
export const classFolderAtom = atom<ExtendedFolder[]>([]);
export const activeClassFolderIdAtom = atom<string | null>(null);
export const activeNoteIdAtom = atom<string | null>(null);

// For Discussion
export const activeDiscussionTabAtom = atom<DiscussionTab | null>(null);
export const activeDiscussionIdAtom = atom<string | null>(null);
