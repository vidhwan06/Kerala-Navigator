
import * as dotenv from 'dotenv';
import { personalisedTravelItinerary } from './src/ai/flows/personalized-itinerary-generation';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

async function run() {
    console.log('Testing Itinerary Generation for Munnar (3 days)...');

    if (!process.env.GOOGLE_GENAI_API_KEY) {
        console.error("Error: GOOGLE_GENAI_API_KEY is missing in .env.local");
        return;
    }

    try {
        // calling the flow directly
        const result = await personalisedTravelItinerary({
            place: 'Munnar',
            days: 3
        });

        console.log('--- ITINERARY RESULT ---');
        console.log(JSON.stringify(result, null, 2));
        console.log('------------------------');
    } catch (err) {
        console.error('Execution Error:', err);
    }
}

run();
