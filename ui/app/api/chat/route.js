import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    messages: convertToModelMessages(messages),
  });

  // const metadata = providerMetadata?.google;
  // const groundingMetadata = metadata?.groundingMetadata;
  // const safetyRatings = metadata?.safetyRatings;

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    sendToolCalls: true,
  });
}
