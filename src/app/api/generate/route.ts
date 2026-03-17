import { AiPersonal } from "@/config/ai";
import { PromptValidator } from "@/types/validator";

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "") {
    return new Response(
      "Missing GROQ_API_KEY - make sure to add it to your .env file.",
      { status: 400 },
    );
  }

  const body = await req.json();
  const { prompt, classDescription, personal, temperature, classTitle } =
    PromptValidator.parse(body);

  const customTemperature = temperature ?? 0.2;
  const validDescription = classDescription && classDescription !== "";
  const validTitle = classTitle && classTitle !== "";
  const predefinedPrompt = personal ?? AiPersonal.TEACHER;

  const systemContent =
    `${predefinedPrompt} ` +
    (validTitle
      ? `This is the classroom name provided by the teacher: ${classDescription} `
      : "") +
    (validDescription
      ? `This is the classroom description provided by the teacher: ${classTitle} `
      : "");

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt },
          ],
          temperature: customTemperature,
          top_p: 1,
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", response.status, error);
      return new Response(error, { status: response.status });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return new Response("Failed to get response stream", { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const text =
                  parsed.choices?.[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text));
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Generate route error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
