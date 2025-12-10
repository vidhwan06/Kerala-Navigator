import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataTsPath = path.join(process.cwd(), 'src/lib/data.ts');
const missingFilesPath = path.join(process.cwd(), 'missing_files.json');
const attractionsDir = path.join(process.cwd(), 'src/lib/data/attractions');

// Read files
const dataTsContent = fs.readFileSync(dataTsPath, 'utf8');
const missingFiles = JSON.parse(fs.readFileSync(missingFilesPath, 'utf8'));

// Helper to extract field from a string block
function extractField(block, fieldName) {
    const regex = new RegExp(`${fieldName}:\\s*['"]([^'"]+)['"]`);
    const match = block.match(regex);
    return match ? match[1] : '';
}

// Template for the JSON file
function generateTemplate(data) {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        location: {
            latitude: 10.0, // Placeholder
            longitude: 76.0, // Placeholder
            address: `${data.location}, ${data.district}, Kerala`,
            city: data.location
        },
        images: [data.imageId],
        history: {
            short_description: data.description,
            detailed: `Detailed history of ${data.name} will be added soon. This is a placeholder description for the historic and cultural significance of this location.`
        },
        significance: {
            religious: "Significance details coming soon.",
            cultural: "Cultural importance details coming soon.",
            tourism: "A major tourist attraction in Kerala.",
            heritage: "Heritage value details coming soon."
        },
        visitor_info: {
            timings: [
                { session: "Morning", start_time: "9:00 AM", end_time: "1:00 PM" },
                { session: "Evening", start_time: "2:00 PM", end_time: "5:00 PM" }
            ],
            entry_fee: {
                general_darshan: "Free / Check at counter",
                special_darshan: "N/A"
            },
            dress_code: {
                men: { required: "Casual / Respectful clothing" },
                women: { required: "Casual / Respectful clothing" }
            },
            best_time_to_visit: "September to March",
            average_crowd_level: "Moderate",
            entry_rules: {
                only_hindus_allowed_inside: false,
                photography_allowed_inside: true,
                mobile_phones_allowed_inside: true,
                warning: "Please verify timings locally."
            },
            activities: ["Sightseeing", "Photography"]
        },
        nearby_accommodations: [
            {
                name: "Local Stay",
                type: "Hotel",
                distance_km: 2,
                location_note: "Near city center",
                recommended_for: ["Families", "Couples"]
            }
        ],
        nearby_food_places: [
            {
                name: "Local Cuisine Restaurant",
                type: "Restaurant",
                cuisine: ["Kerala", "South Indian"],
                specialties: ["Meals", "Snacks"]
            }
        ],
        transport: {
            nearest_airport: {
                name: "Cochin International Airport (COK)",
                approx_distance_km: 50,
                travel_options: ["Taxi", "Bus"]
            },
            nearest_railway_station: {
                name: "Nearest Railway Station",
                approx_distance_km: 10,
                travel_options: ["Auto", "Taxi"]
            },
            by_road: {
                description: "Accessible by road.",
                parking_info: "Parking available nearby."
            }
        },
        reviews_summary: {
            overall_rating_out_of_5: 4.5,
            highlights: ["Scenic beauty", "Peaceful atmosphere"],
            common_complaints: ["Crowded on weekends"],
            tips_from_visitors: ["Carry water", "Wear comfortable shoes"]
        }
    };
}

console.log(`Generating ${missingFiles.length} files...`);

missingFiles.forEach(id => {
    // Find the block in data.ts
    // This regex looks for the object definition starting with the ID
    // It's a bit simple and assumes standard formatting in data.ts
    const blockRegex = new RegExp(`{\\s*id:\\s*['"]${id}['"][\\s\\S]*?},`, 'm');
    const match = dataTsContent.match(blockRegex);

    if (match) {
        const block = match[0];
        const data = {
            id: id,
            name: extractField(block, 'name'),
            description: extractField(block, 'description'),
            location: extractField(block, 'location'),
            imageId: extractField(block, 'imageId'),
            district: extractField(block, 'district')
        };

        const jsonContent = generateTemplate(data);
        const filePath = path.join(attractionsDir, `${id}.json`);

        fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
        console.log(`Created ${id}.json`);
    } else {
        console.error(`Could not find data for ID: ${id} in data.ts`);
    }
});

console.log('Done.');
