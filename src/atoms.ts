import { atom } from "jotai";

import {
  ExtendedEvent,
  ExtendedFolder,
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";
import { DiscussionTab } from "@/components/discussions/discussion-tabs";
import { AssignmentStatus } from "@/components/assignment/assignment-filter";

// For Sections
export const createdClassSections = atom<ExtendedSectionWithClassrooms[]>([]);
export const joinedClassSections = atom<ExtendedSectionWithMemberships[]>([]);

// For section closing
export const isCloseAllCreationToggle = atom<boolean | null>(null);
export const isCloseAllMembershipToggle = atom<boolean | null>(null);

// For getting editor content
export const isSubmittingAtom = atom<boolean | undefined>(undefined);
export const contentAtom = atom<undefined | any>(undefined);

// For storing assignment status
export const assignmentStatusAtom = atom<AssignmentStatus>("pending");

// For dashboard folders
export const folderAtom = atom<ExtendedFolder[]>([]);
export const activeFolderIdAtom = atom<string | null>(null);

// For classroom folders
export const globalLoaderAtom = atom(false);
export const classFolderAtom = atom<ExtendedFolder[]>([]);
export const activeClassFolderIdAtom = atom<string | null>(null);
export const activeNoteIdAtom = atom<string | null>(null);

// For Discussion
export const activeDiscussionTabAtom = atom<DiscussionTab | null>(null);
export const activeDiscussionIdAtom = atom<string | null>(null);

// For Calendar
export const activeDateAtom = atom<{
  event: ExtendedEvent;
  dateColumn: Date;
} | null>(null);

export const overDateAtom = atom<Date | null>(null);
