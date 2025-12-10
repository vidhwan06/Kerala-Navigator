import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read data.ts content
const dataTsContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/data.ts'), 'utf8');

// Extract IDs using regex
const idRegex = /id:\s*'([^']+)'/g;
let match;
const ids = [];
while ((match = idRegex.exec(dataTsContent)) !== null) {
    // Skip district IDs (they are usually 3 letters like 'tvm', 'klm')
    if (match[1].length > 3) {
        ids.push(match[1]);
    }
}

console.log(`Found ${ids.length} attraction IDs in data.ts`);

// Check for file existence
const attractionsDir = path.join(process.cwd(), 'src/lib/data/attractions');
const missingFiles = [];

ids.forEach(id => {
    const filePath = path.join(attractionsDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
        missingFiles.push(id);
    }
});

console.log('Missing JSON files for the following IDs:');
console.log(JSON.stringify(missingFiles, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'missing_files.json'), JSON.stringify(missingFiles, null, 2));
