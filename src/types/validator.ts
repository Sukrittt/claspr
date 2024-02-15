import { z } from "zod";

export const PromptValidator = z.object({
  prompt: z.string(),
  classDescription: z.string().nullable().optional(),
  classTitle: z.string().nullable().optional(),
  personal: z.optional(z.string()),
  temperature: z.optional(z.number()),
  addInfo: z.optional(z.string()),
});

export type PromptValidatorType = z.infer<typeof PromptValidator>;
