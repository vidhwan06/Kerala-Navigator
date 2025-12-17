
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load env vars
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const key = process.env.GOOGLE_GENAI_API_KEY || "";
console.log("API Key present:", !!key);
console.log("API Key prefix:", key.substring(0, 4) + "...");

const ai = genkit({
    plugins: [
        googleAI({
            apiKey: key,
        }),
    ],
    model: googleAI.model("gemini-2.5-flash"),
});

async function test() {
    try {
        console.log("Testing generation with gemini-2.5-flash...");
        // Actually the code uses 1.5-flash now.
        const { text } = await ai.generate({
            model: googleAI.model("gemini-2.5-flash"),
            prompt: "Hello, are you working?",
        });
        console.log("Success:", text);
    } catch (e) {
        console.log("--- ERROR DETAILS ---");
        console.log("Message:", e.message);
        if (e.status) console.log("Status:", e.status);
        if (e.originalMessage) console.log("Original Message:", e.originalMessage);
        // console.log("Full Error:", JSON.stringify(e, null, 2));
        console.log("---------------------");
    }
}

test();
