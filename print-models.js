
import fs from 'fs';
try {
    const content = fs.readFileSync('models-list.txt', 'utf8');
    console.log(content);
} catch (e) {
    console.error("Error reading file:", e);
}
