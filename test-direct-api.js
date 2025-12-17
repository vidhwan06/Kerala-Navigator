
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) process.env[k] = envConfig[k];
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

async function run() {
    const modelsToTest = ["gemini-1.5-flash", "gemini-2.5-flash", "models/gemini-2.5-flash"];

    for (const modelName of modelsToTest) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello!");
            console.log(`YES! Response from ${modelName}:`, result.response.text());
        } catch (e) {
            console.error(`NO! Error ${modelName}:`, e.message);
        }
        console.log('---');
    }
}

run();
