import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// 🔑 1. Configure Genkit + Google AI with your API key
const ai = genkit({
  plugins: [
    googleAI({

      apiKey: process.env.GOOGLE_GENAI_API_KEY ?? false,


    }),
  ],
  // Optional default model
  model: googleAI.model("gemini-1.5-flash"),
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
      itinerary: z.string(),
    }),
  },

  // 3. Flow logic – actually calls Gemini
  async ({ place, days }) => {
    const { text } = await ai.generate({

      // model: googleAI.model("gemini-1.5-flash"),

      model: googleAI.model("gemini-1.5-flash"),

      prompt: `
You are a helpful Kerala tourism travel planner.

Create a detailed ${days}-day travel itinerary for ${place} in Kerala.

For EACH day include:
- Day title (e.g. "Day 1 – Arrival & Beach Time")
- Morning plan
- Afternoon plan
- Evening plan
- Approx travel times between places
- 2–3 food / restaurant suggestions
- 2–3 short tips or cautions

Format it neatly with headings and bullet points.
      `,
    });

    return { itinerary: text ?? "Sorry, could not generate itinerary." };
  }
);
