
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

async function run() {
    console.log("Starting debug script...");
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
    const key = process.env.GOOGLE_GENAI_API_KEY;
    console.log("API Key exists:", !!key);

    const ai = genkit({
        plugins: [googleAI({ apiKey: key })],
        model: googleAI.model("gemini-2.5-flash"),
    });

    try {
        console.log("Attempting generation with gemini-2.5-flash...");
        const response = await ai.generate({
            model: googleAI.model("gemini-2.5-flash"),
            prompt: "Say hello",
        });
        console.log("Success Result:", response.text);
    } catch (e) {
        console.error("Caught Error:", e);
    }

    try {
        console.log("Attempting generation with gemini-1.5-flash...");
        const response = await ai.generate({
            model: googleAI.model("gemini-1.5-flash"),
            prompt: "Say hello",
        });
        console.log("Success Result 1.5:", response.text);
    } catch (e) {
        console.error("Caught Error 1.5:", e);
    }
}

run();
