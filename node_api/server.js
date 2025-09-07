import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { z } from "zod";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const tools = {
  google_search: google.tools.googleSearch({}),
  //   getWeather: tool({
  //     description: "Get the weather for a location",
  //     inputSchema: z.object({
  //       city: z.string().describe("The city to get the weather for"),
  //       unit: z
  //         .enum(["C", "F"])
  //         .describe("The unit to display the temperature in"),
  //     }),
  //     execute: async ({ city, unit }) => {
  //       const weather = {
  //         value: 24,
  //         description: "Sunny",
  //       };

  //       return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
  //     },
  //   }),
};

app.post("/", async (req, res) => {
  const { messages } = req.body;
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });

  result.pipeUIMessageStreamToResponse(res);
});

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`);
});
