import { ReactionType } from "@prisma/client";

export const acceptFileExtensions =
  "image/*, audio/*, .gif, .pdf, .wav, .doc, .docx, .txt, .java, .py, .cpp, .html, .css, .js, .ts, .jsx, .tsx, .sass, .scss, .php, .rb, .pl, .lua, .sh, .json, .yaml, .xml, .csv, .sql, .asm, .c, .cs, .swift, .go, .r, .dart, .ads, .ml, .mli, .svg, .class";

export const discussionPlaceholders = {
  announcements: {
    title: "Make an announcement",
    description: "Share important information with your class",
    placeholder: "E.g: Exam schedule, Class cancellation, etc.",
    editorPlaceholder: "What's on your mind?",
    btnLabel: "Create",
  },
  general: {
    title: "Start a discussion",
    description: "General discussions with your class",
    placeholder: "E.g: What's your favorite programming language?",
    editorPlaceholder: "What's on your mind?",
    btnLabel: "Start",
  },
  questionnaires: {
    title: "Ask a question",
    description: "You can select the best answer for your question",
    placeholder: "E.g: What is data flow diagram?",
    editorPlaceholder: "Provide further details on your question...",
    btnLabel: "Ask",
  },
  ideas: {
    title: "Share an idea",
    description: "Share your ideas with your class",
    placeholder: "E.g: I have an idea for the next project",
    editorPlaceholder: "Provide further details on your idea...",
    btnLabel: "Share",
  },
};

export const listOfReactions: {
  emoji: string;
  value: ReactionType;
  label: string;
}[] = [
  {
    emoji: "👍",
    value: "THUMBS_UP",
    label: "Thumbs Up",
  },
  {
    emoji: "👎",
    value: "THUMBS_DOWN",
    label: "Thumbs Down",
  },
  {
    emoji: "😄",
    value: "SMILE",
    label: "Happy",
  },
  {
    emoji: "🎉",
    value: "PARTY_POPPER",
    label: "Party Popper",
  },
  {
    emoji: "😢",
    value: "SAD",
    label: "Sad",
  },
  {
    emoji: "❤️",
    value: "HEART",
    label: "Heart",
  },
  {
    emoji: "🚀",
    value: "ROCKET",
    label: "Rocket",
  },
  {
    emoji: "👀",
    value: "EYES",
    label: "Eyes",
  },
];

export const gradientColors = [
  {
    id: 1,
    gradientClass: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    name: "purple-pink-red",
  },
  {
    id: 2,
    gradientClass: "bg-gradient-to-r from-yellow-300 via-green-400 to-blue-500",
    name: "yellow-green-blue",
  },
  {
    id: 3,
    gradientClass: "bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500",
    name: "teal-blue-indigo",
  },
  {
    id: 4,
    gradientClass: "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500",
    name: "orange-red-pink",
  },
  {
    id: 5,
    gradientClass:
      "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
    name: "blue-indigo-purple",
  },
  {
    id: 6,
    gradientClass: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500",
    name: "yellow-red-pink",
  },
  {
    id: 7,
    gradientClass: "bg-gradient-to-r from-green-400 via-teal-500 to-blue-500",
    name: "green-teal-blue",
  },
  {
    id: 8,
    gradientClass: "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500",
    name: "yellow-orange-red",
  },
  {
    id: 9,
    gradientClass:
      "bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600",
    name: "purple-indigo-blue",
  },
  {
    id: 10,
    gradientClass:
      "bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-500 to-indigo-700",
    name: "green-yellow-orange",
  },
  {
    id: 11,
    gradientClass: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    name: "violet-fuchsia",
  },
  {
    id: 12,
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
    name: "sky-indigo",
  },
];

export type GradientColor = (typeof gradientColors)[number];

export const EVENT_DATE_FORMAT = "yyyy-MM-dd";
