import { ReactionType } from "@prisma/client";

export const acceptFileExtensions =
  "image/*, audio/*, .gif, .pdf, .wav, .doc, .docx, .txt, .java, .py, .cpp, .html, .css, .js, .ts, .jsx, .tsx, .sass, .scss, .php, .rb, .pl, .lua, .sh, .json, .yaml, .xml, .csv, .sql, .asm, .c, .cs, .swift, .go, .r, .dart, .ads, .ml, .mli, .svg, .class";

export const discussionPlaceholders = {
  announcements: {
    title: "Make an announcement",
    description: "Share important information with your class",
    placeholder: "E.g: Exam schedule, Class cancellation, etc.",
    editorPlaceholder: "What's on your mind?",
  },
  general: {
    title: "Start a discussion",
    description: "General discussions with your class",
    placeholder: "E.g: What's your favorite programming language?",
    editorPlaceholder: "What's on your mind?",
  },
  questionnaires: {
    title: "Ask a question",
    description: "Ask a question to your class",
    placeholder: "E.g: What's your favorite programming language?",
    editorPlaceholder: "What's on your mind?",
  },
};

export const listOfReactions: { emoji: string; value: ReactionType }[] = [
  {
    emoji: "👍",
    value: "THUMBS_UP",
  },
  {
    emoji: "👎",
    value: "THUMBS_DOWN",
  },
  {
    emoji: "😄",
    value: "SMILE",
  },
  {
    emoji: "🎉",
    value: "PARTY_POPPER",
  },
  {
    emoji: "😢",
    value: "SAD",
  },
  {
    emoji: "❤️",
    value: "HEART",
  },
  {
    emoji: "🚀",
    value: "ROCKET",
  },
  {
    emoji: "👀",
    value: "EYES",
  },
];
