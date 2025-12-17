
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

// Manual env loading
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

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!API_KEY) {
    console.error("No API key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`Listing models via direct API call...`);

fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(async res => {
    const json = await res.json();
    const outPath = path.resolve(process.cwd(), 'curl_output.json');
    fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8');

    if (!res.ok) {
        console.error("Error Status:", res.status);
    } else {
        console.log("Success! Written to curl_output.json");
    }
}).catch(err => {
    console.error("Fetch Error:", err);
});
