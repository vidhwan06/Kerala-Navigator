
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env vars manually
const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GOOGLE_GENAI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

if (!apiKey) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

const data = JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (error) => {
    console.error("Error:", error);
});

req.write(data);
req.end();
