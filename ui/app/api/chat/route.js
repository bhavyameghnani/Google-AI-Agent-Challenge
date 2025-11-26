import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

// Allow streaming responses up to 180 seconds
export const maxDuration = 180;

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    sendToolCalls: true,
  });
}
