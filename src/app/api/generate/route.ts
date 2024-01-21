import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

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

  //   const session = await getAuthSession();
  const { prompt, classroomId } = await req.json();

  //   if (!session) {
  //     return new Response("Unauthorized", { status: 401 });
  //   }

  //   const classroom = await db.classRoom.findFirst({
  //     where: {
  //       id: classroomId,
  //     },
  //     include: {
  //       conversations: true,
  //     },
  //   });

  //   if (!classroom) {
  //     return new Response("Classroom not found", { status: 404 });
  //   }

  //   const prevConversations = classroom.conversations
  //     .map((c) => c.text)
  //     .join("\n\n");

  //   await db.conversation.create({
  //     data: {
  //       text: prompt,
  //       classRoomId: classroomId,
  //       userId: session.user.id,
  //     },
  //   });

  //   const validDescription =
  //     classroom.description && classroom.description !== "";

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an experienced teacher providing insightful answers to student queries. " +
          "Please keep your responses under 800 characters, ensuring clarity and correctness.\n",
        //   (validDescription
        //     ? `This is the classroom description provided by the teacher: ${classroom.description}`
        //     : "") +
        //   (prevConversations.length > 0
        //     ? "Also, here are some previous conversations asked by this person to help you out:\n" +
        //       prevConversations
        //     : ""),
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
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
