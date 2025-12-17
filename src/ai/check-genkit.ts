
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import * as fs from 'fs';
import * as path from 'path';

// Manual env loading for standalone script
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) {
            process.env[key.trim()] = val.trim();
        }
    });
}

console.log("API Key present:", !!process.env.GOOGLE_GENAI_API_KEY);
if (process.env.GOOGLE_GENAI_API_KEY) {
    console.log("API Key length:", process.env.GOOGLE_GENAI_API_KEY.length);
}

async function main() {
    try {
        const ai = genkit({
            plugins: [
                googleAI({
                    apiKey: process.env.GOOGLE_GENAI_API_KEY,
                }),
            ],
            model: googleAI.model("gemini-2.5-flash"),
        });

        console.log("Generating with gemini-2.5-flash...");
        const { output } = await ai.generate({
            model: googleAI.model("gemini-2.5-flash"),
            prompt: "Hello, tell me a joke about programming.",
        });

        console.log("Success!");
        console.log(output);
    } catch (error: any) {
        console.error("Genkit Error:", error);
        if (error.details) console.error("Details:", error.details);
    }
}

main();
