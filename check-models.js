
import fs from 'fs';
import https from 'https';

// Load env (manual parsing to avoid dependencies)
let apiKey = '';
try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GOOGLE_GENAI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local", e);
    process.exit(1);
}

if (!apiKey) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Checking models... Key length: ${apiKey.length}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            const json = JSON.parse(data);
            if (json.models) {
                const modelNames = json.models.map(m => m.name);
                fs.writeFileSync('models-list.txt', modelNames.join('\n'));
                console.log("Model list saved to models-list.txt");
                console.log("Available Models:");
                json.models.forEach(m => console.log(` - ${m.name}`));

                // Check for specific model match
                const hasFlash = json.models.some(m => m.name.includes('gemini-1.5-flash'));
                console.log("\nHas gemini-1.5-flash?", hasFlash);
            } else {
                console.log("No models found in response:", data);
            }
        } else {
            console.log("Error response:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
