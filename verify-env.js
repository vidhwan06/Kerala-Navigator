// Verification script to check if GOOGLE_GENAI_API_KEY is configured
// using node --env-file to load env vars

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

console.log('\n=== Environment Variable Check ===\n');

if (!apiKey) {
    console.log('❌ GOOGLE_GENAI_API_KEY is NOT set in .env.local');
    console.log('\nTo fix this:');
    console.log('1. Open or create the file: .env.local');
    console.log('2. Add the following line:');
    console.log('   GOOGLE_GENAI_API_KEY=your_api_key_here');
    console.log('3. Replace "your_api_key_here" with your actual Google Gemini API key');
    console.log('4. Save the file and restart the dev server');
    console.log('\nTo get an API key:');
    console.log('- Visit: https://aistudio.google.com/app/apikey');
    console.log('- Sign in with your Google account');
    console.log('- Click "Create API Key"');
    process.exit(1);
} else {
    const maskedKey = apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
    console.log('✅ GOOGLE_GENAI_API_KEY is set');
    console.log(`   Key (masked): ${maskedKey}`);
    console.log(`   Length: ${apiKey.length} characters`);

    if (apiKey.length < 20) {
        console.log('\n⚠️  Warning: API key seems too short. Please verify it is correct.');
    } else {
        console.log('\n✅ API key appears to be configured correctly!');
        console.log('\nIf the itinerary planner still fails:');
        console.log('1. Verify the key is valid at: https://aistudio.google.com/app/apikey');
        console.log('2. Make sure the dev server was restarted after adding the key');
        console.log('3. Check the browser console and server logs for specific errors');
    }
}

console.log('\n=================================\n');
