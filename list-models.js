
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Error testing gemini-1.5-flash:", error.message);
    }

    try {
        // fallback check for other common names if the above fails
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        const result2 = await model2.generateContent("Hello");
        console.log("Success with gemini-pro:", result2.response.text());
    } catch (e) {
        console.log("gemini-pro also failed");
    }
}

listModels();
