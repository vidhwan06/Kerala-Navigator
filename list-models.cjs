
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GOOGLE_GENAI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET',
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('models_list.json', body);
        console.log("Written to models_list.json");
    });
});

req.on('error', (error) => { console.error(error); });
req.end();
