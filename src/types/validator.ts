import { z } from "zod";

export const PromptValidator = z.object({
  prompt: z.string(),
  classDescription: z.string().nullable(),
  prevConversations: z.array(
    z.object({
      prompt: z.string(),
      answer: z.string(),
    })
  ),
});

export type PromptValidatorType = z.infer<typeof PromptValidator>;
