
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) process.env[k] = envConfig[k];
}

const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
});

async function run() {
    console.log("Testing Genkit with gemini-1.5-flash...");
    try {
        const { text } = await ai.generate({
            model: googleAI.model("gemini-1.5-flash"),
            prompt: "Hi",
        });
        console.log("Success 1.5:", text);
    } catch (e) {
        console.error("Error 1.5:", e.message);
    }
}
run();
