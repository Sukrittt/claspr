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
    description: "You can select the best answer for your question",
    placeholder: "E.g: What is data flow diagram?",
    editorPlaceholder: "Provide further details on your question...",
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
