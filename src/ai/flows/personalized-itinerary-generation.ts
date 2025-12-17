import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// 🔑 1. Configure Genkit + Google AI with your API key
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
    }),
  ],
  // Optional default model
  model: googleAI.model("gemini-2.5-flash"),
});

// 🚀 2. Define the itinerary flow
export const personalisedTravelItinerary = ai.defineFlow(
  {
    name: "personalisedTravelItinerary",
    inputSchema: z.object({
      place: z.string().describe("Destination name, e.g. Munnar, Kochi"),
      days: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(2)
        .describe("Number of days for the trip"),
    }),
    outputSchema: z.object({
      itinerary: z.array(z.object({
        day: z.number(),
        title: z.string(),
        morning: z.string(),
        afternoon: z.string(),
        evening: z.string(),
        travelTime: z.string(),
        food: z.array(z.string()),
        tips: z.array(z.string()),
      })),
    }),
  },

  // 3. Flow logic – actually calls Gemini
  async ({ place, days }) => {
    const { output } = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      prompt: `
You are a helpful Kerala tourism travel planner.
Create a detailed ${days}-day travel itinerary for ${place} in Kerala.
Return ONLY a valid JSON object with the following structure:
{
  "itinerary": [
    {
      "day": number,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "travelTime": "string",
      "food": ["string"],
      "tips": ["string"]
    }
  ]
}
      `,
    });

    if (!output) {
      throw new Error("Failed to generate itinerary");
    }

    return output;
  }
);
