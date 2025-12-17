
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars FIRST
dotenv.config({ path: '.env.local' });

async function run() {
    console.log('Testing Structured Itinerary Generation for Munnar (2 days)...');

    // Dynamic import to ensure env vars are loaded before genkit.ts runs
    const { personalisedTravelItinerary } = await import('./src/ai/flows/personalized-itinerary-generation');

    try {
        const result = await personalisedTravelItinerary({
            place: 'Munnar',
            days: 2
        });

        console.log('--- ITINERARY RESULT ---');
        console.log(JSON.stringify(result, null, 2));

        if (result.itinerary && Array.isArray(result.itinerary)) {
            console.log('\n✅ Success! Received an array of days.');
            result.itinerary.forEach((day: any, i: number) => {
                console.log(`\nDay ${day.day}: ${day.title}`);
                console.log(`Activities: Morning: ${day.morning.substring(0, 20)}...`);
                if (!day.food || !Array.isArray(day.food)) console.error(`❌ Day ${i + 1} missing food array`);
            });
        } else {
            console.error('❌ Failed: Result is not a structured array', result);
        }

    } catch (err) {
        console.error('Execution Error:', err);
    }
}

run();
