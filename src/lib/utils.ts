import moment from "moment";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

import {
  ExtendedFolder,
  ExtendedSectionWithClassrooms,
  ExtendedSectionWithMemberships,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function timeAgo(timestamp: Date) {
  const postDate = new Date(timestamp);
  let time = moment(postDate).fromNow();
  time = time.replace("a ", "");
  time = time.replace("an ", "");
  time = time.replace("few seconds", "5s");
  time = time.replace(" seconds", "s");
  time = time.replace(" minutes", " min");
  time = time.replace("minute", "1 min");
  time = time.replace(" hours", "hr");
  time = time.replace("hour", "1hr");
  time = time.replace(" days", "d");
  time = time.replace("day", "1d");
  time = time.replace(" months", "months");
  time = time.replace("month", "1 month");
  time = time.replace(" years", "y");
  time = time.replace("year", "1y");
  return time;
}

export function getShortenedText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const getSortedSectionsByOrder = (
  sections: ExtendedSectionWithClassrooms[] | ExtendedSectionWithMemberships[]
) => {
  return sections.sort((a, b) => a.order - b.order);
};

export const getSortedFoldersByOrder = (folders: ExtendedFolder[]) => {
  return folders.sort((a, b) => b.order - a.order);
};

export const getFilteredResponse = (text: string) => {
  const underscoreIndex = text.lastIndexOf("^^");
  const result =
    underscoreIndex !== -1 ? text.substring(0, underscoreIndex) : text;

  return result;
};

export const getSubmissionStatusFromQuery = (queryStatus: string | null) => {
  if (
    !queryStatus ||
    queryStatus.length === 0 ||
    queryStatus === "not-submitted"
  )
    return "pending";

  return queryStatus;
};
