
import fs from 'fs';

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/itinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                interests: "culture",
                duration: 3,
                locations: "Kochi",
                travelStyle: "Relaxed",
                budget: "Mid-range",
                accommodationType: "Hotels"
            })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response length:', text.length);

        fs.writeFileSync('debug-output.log', `Status: ${response.status}\n\nBody:\n${text}`);
        console.log('Output saved to debug-output.log');

    } catch (error) {
        console.error('Error:', error);
        fs.writeFileSync('debug-output.log', `Error: ${error.message}\n${error.stack}`);
    }
}

testApi();
