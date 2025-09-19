import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, companyData } = await req.json();
    console.log(companyData);
    const systemPrompt = `You are a business analyst AI with comprehensive data about ${JSON.stringify(
      companyData,
      null,
      2
    )}. Always use this data when answering questions about the company.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
      sendToolCalls: true,
    });
  } catch (error) {
    console.error("=== API ERROR ===", error);
    return new Response(
      JSON.stringify({
        error: "API Error",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
