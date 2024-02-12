import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { AiPersonal } from "@/config/ai";
import { PromptValidator } from "@/types/validator";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      }
    );
  }

  const body = await req.json();
  const { prompt, classDescription, personal, temperature, classTitle } =
    PromptValidator.parse(body);

  const customTemperature = temperature ?? 0.2;
  const validDescription = classDescription && classDescription !== "";
  const validTitle = classTitle && classTitle !== "";
  const predefinedPrompt = personal ?? AiPersonal.TEACHER;

  const content =
    `${predefinedPrompt} ` +
    (validTitle
      ? `This is the classroom name provided by the teacher: ${classDescription} `
      : "") +
    (validDescription
      ? `This is the classroom description provided by the teacher: ${classTitle} `
      : "");

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: customTemperature,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
