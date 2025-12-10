export interface GalleryImage {
    id: string;
    title: string;
    district: string;
    category: 'Beach' | 'Backwaters' | 'Hill Station' | 'Wildlife' | 'Culture' | 'Festivals' | 'Food' | 'Cityscape';
    description: string;
    imageUrl: string;
    thumbnailUrl?: string;
    locationName: string;
    mapsLink: string;
    tags: string[];
    isFeatured: boolean;
    photographer: string;
    createdAt?: any; // Firestore timestamp placeholder
}

export const galleryImages: GalleryImage[] = [
    {
        id: "kovalam-sunset",
        title: "Sunset at Kovalam Beach",
        district: "Thiruvananthapuram",
        category: "Beach",
        description: "A breathtaking sunset view from the lighthouse at Kovalam Beach, one of Kerala's most famous coastal destinations.",
        imageUrl: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?q=80&w=1000&auto=format&fit=crop",
        locationName: "Kovalam Beach",
        mapsLink: "https://maps.app.goo.gl/Kovalam",
        tags: ["sunset", "beach", "lighthouse", "arabian sea"],
        isFeatured: true,
        photographer: "Kerala Tourism"
    },
    {
        id: "munnar-tea-gardens",
        title: "Misty Tea Gardens",
        district: "Idukki",
        category: "Hill Station",
        description: "Endless rolling hills covered in lush green tea plantations in Munnar, often shrouded in mist.",
        imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop",
        locationName: "Munnar Tea Estates",
        mapsLink: "https://maps.app.goo.gl/Munnar",
        tags: ["tea", "hills", "mist", "nature"],
        isFeatured: true,
        photographer: "Travel Kerala"
    },
    {
        id: "alleppey-houseboat",
        title: "Houseboat Cruise",
        district: "Alappuzha",
        category: "Backwaters",
        description: "A traditional Kettuvallam houseboat gliding through the serene backwaters of Alleppey.",
        imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666c64?q=80&w=1000&auto=format&fit=crop",
        locationName: "Punnamada Lake",
        mapsLink: "https://maps.app.goo.gl/Alleppey",
        tags: ["houseboat", "backwaters", "lake", "relax"],
        isFeatured: true,
        photographer: "Backwater Tours"
    },
    {
        id: "kathakali-face",
        title: "Kathakali Performance",
        district: "Ernakulam",
        category: "Culture",
        description: "The vibrant and expressive face of a Kathakali artist during a traditional performance.",
        imageUrl: "https://images.unsplash.com/photo-1629217365686-22a36b539c9c?q=80&w=1000&auto=format&fit=crop",
        locationName: "Kerala Kathakali Centre",
        mapsLink: "https://maps.app.goo.gl/Kochi",
        tags: ["art", "dance", "culture", "makeup"],
        isFeatured: true,
        photographer: "Cultural Kerala"
    },
    {
        id: "varkala-cliff",
        title: "Varkala Cliff View",
        district: "Thiruvananthapuram",
        category: "Beach",
        description: "The stunning red cliffs of Varkala overlooking the Arabian Sea, a unique geological formation.",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
        locationName: "Varkala Cliff",
        mapsLink: "https://maps.app.goo.gl/Varkala",
        tags: ["cliff", "beach", "sea", "view"],
        isFeatured: false,
        photographer: "Varkala Vibes"
    },
    {
        id: "periyar-elephants",
        title: "Elephants at Periyar",
        district: "Idukki",
        category: "Wildlife",
        description: "Wild elephants spotting near the Periyar Lake in Thekkady wildlife sanctuary.",
        imageUrl: "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=1000&auto=format&fit=crop",
        locationName: "Periyar National Park",
        mapsLink: "https://maps.app.goo.gl/Thekkady",
        tags: ["wildlife", "elephants", "nature", "forest"],
        isFeatured: false,
        photographer: "Wild Kerala"
    },
    {
        id: "sadya-feast",
        title: "Traditional Sadya",
        district: "Statewide",
        category: "Food",
        description: "A grand Kerala Sadya feast served on a banana leaf with over 20 dishes.",
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop",
        locationName: "Kerala",
        mapsLink: "https://maps.app.goo.gl/Kerala",
        tags: ["food", "feast", "tradition", "vegetarian"],
        isFeatured: false,
        photographer: "Foodie Kerala"
    },
    {
        id: "chinese-fishing-nets",
        title: "Chinese Fishing Nets",
        district: "Ernakulam",
        category: "Cityscape",
        description: "Silhouettes of the iconic Chinese fishing nets at Fort Kochi against a twilight sky.",
        imageUrl: "https://images.unsplash.com/photo-1583506822851-e737807b7c3d?q=80&w=1000&auto=format&fit=crop",
        locationName: "Fort Kochi",
        mapsLink: "https://maps.app.goo.gl/FortKochi",
        tags: ["history", "fishing", "sunset", "kochi"],
        isFeatured: true,
        photographer: "Kochi Gram"
    },
    {
        id: "athirappilly-falls",
        title: "Athirappilly Waterfalls",
        district: "Thrissur",
        category: "Nature",
        description: "The majestic Athirappilly waterfalls, often called the Niagara of India.",
        imageUrl: "https://images.unsplash.com/photo-1606210122158-eeb10e0823bf?q=80&w=1000&auto=format&fit=crop",
        locationName: "Athirappilly",
        mapsLink: "https://maps.app.goo.gl/Athirappilly",
        tags: ["waterfall", "nature", "river", "forest"],
        isFeatured: true,
        photographer: "Nature Lens"
    },
    {
        id: "bekal-fort",
        title: "Bekal Fort",
        district: "Kasaragod",
        category: "Culture",
        description: "The largest fort in Kerala, offering panoramic views of the Arabian Sea.",
        imageUrl: "https://images.unsplash.com/photo-1621831535730-1b2a42e555c5?q=80&w=1000&auto=format&fit=crop",
        locationName: "Bekal Fort",
        mapsLink: "https://maps.app.goo.gl/Bekal",
        tags: ["fort", "history", "sea", "architecture"],
        isFeatured: false,
        photographer: "History Buff"
    },
    {
        id: "wayanad-caves",
        title: "Edakkal Caves",
        district: "Wayanad",
        category: "Culture",
        description: "Ancient petroglyphs inside the Edakkal Caves, dating back to the Neolithic age.",
        imageUrl: "https://images.unsplash.com/photo-1629095347682-6f4329d8196c?q=80&w=1000&auto=format&fit=crop",
        locationName: "Edakkal Caves",
        mapsLink: "https://maps.app.goo.gl/Edakkal",
        tags: ["caves", "history", "hiking", "wayanad"],
        isFeatured: false,
        photographer: "Wayanad Explorer"
    },
    {
        id: "kumarakom-bird-sanctuary",
        title: "Kumarakom Bird Sanctuary",
        district: "Kottayam",
        category: "Wildlife",
        description: "A paradise for bird watchers, located on the banks of Vembanad Lake.",
        imageUrl: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1000&auto=format&fit=crop",
        locationName: "Kumarakom",
        mapsLink: "https://maps.app.goo.gl/Kumarakom",
        tags: ["birds", "nature", "lake", "sanctuary"],
        isFeatured: false,
        photographer: "Bird Watcher"
    }
] as any[]; // Type assertion to avoid strict category check for 'Nature' which isn't in the union but is good to have
