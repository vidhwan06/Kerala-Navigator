
import * as dotenv from 'dotenv';
import path from 'path';

// Force load from absolute path just to be sure
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env.local:', result.error);
} else {
    console.log('Dotenv loaded successfully.');
}

const key = process.env.GOOGLE_GENAI_API_KEY;
console.log('API Key present:', !!key);
if (key) {
    console.log('API Key prefix:', key.substring(0, 5) + '...');
    console.log('API Key length:', key.length);
} else {
    console.error('API Key is MISSING or empty string.');
}
