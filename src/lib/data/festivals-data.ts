export interface Festival {
    id: string;
    name: string;
    month: string;
    district: string;
    category: string;
    description: string;
    highlights: string[];
    mainLocation: string;
    dateRange: string;
    images: string[];
    mapsLink: string;
    isMajorFestival: boolean;
}

export const festivals: Festival[] = [
    {
        id: "thrissur-pooram",
        name: "Thrissur Pooram",
        month: "April-May",
        district: "Thrissur",
        category: "Temple Festival",
        description: "One of Kerala's grandest temple festivals, known for its majestic elephant processions, traditional percussion ensembles, and spectacular fireworks.",
        highlights: [
            "Caparisoned elephants",
            "Kudamattam umbrella exchange",
            "Melam percussion performances",
            "Night-long fireworks"
        ],
        mainLocation: "Vadakkunnathan Temple Ground, Thrissur",
        dateRange: "Usually falls in April or May (Malayalam month of Medam)",
        images: [
            "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599577239928-1b2a42e555c5?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Vadakkunnathan+Temple+Thrissur",
        isMajorFestival: true
    },
    {
        id: "onam-celebrations",
        name: "Onam Celebrations",
        month: "August-September",
        district: "Statewide",
        category: "Harvest",
        description: "Kerala's biggest harvest festival celebrating the legendary King Mahabali, marked by floral designs, traditional games, Vallamkali boat races, and grand Onam Sadhya feasts.",
        highlights: [
            "Pookalam (floral rangoli)",
            "Onam Sadhya on banana leaf",
            "Traditional games and dances",
            "Vallamkali boat races in some regions"
        ],
        mainLocation: "Across Kerala (notable events in Thiruvananthapuram, Kochi and Thrissur)",
        dateRange: "10-day festival around Thiruvonam day in Aug–Sep",
        images: [
            "https://images.unsplash.com/photo-1598422103565-1c5c76b2087e?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Kerala+Onam+Celebrations",
        isMajorFestival: true
    },
    {
        id: "nehru-trophy-boat-race",
        name: "Nehru Trophy Boat Race",
        month: "August",
        district: "Alappuzha",
        category: "Boat Race",
        description: "The most famous snake boat race in Kerala, held on the Punnamada Lake, featuring long chundan vallams rowing in perfect rhythm.",
        highlights: [
            "Chundan vallam (snake boats)",
            "Competitive rowing teams",
            "Colorful cheering crowds",
            "Live commentary and cultural shows"
        ],
        mainLocation: "Punnamada Lake, Alappuzha",
        dateRange: "Usually held on a Saturday in August",
        images: [
            "https://images.unsplash.com/photo-1599385557766-3d7c57f2f981?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601997387342-990422998782?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Punnamada+Lake+Alappuzha",
        isMajorFestival: true
    },
    {
        id: "aranmula-vallamkali",
        name: "Aranmula Vallamkali",
        month: "August-September",
        district: "Pathanamthitta",
        category: "Boat Race",
        description: "A traditional and spiritual boat pageant held on the Pamba River, associated with the Aranmula Parthasarathy Temple and Onam festivities.",
        highlights: [
            "Palliyodam snake boats",
            "Temple rituals and offerings",
            "Traditional boat songs",
            "Pilgrim atmosphere"
        ],
        mainLocation: "Aranmula Parthasarathy Temple, Aranmula",
        dateRange: "On Uthrittathi day during the Onam season (Aug–Sep)",
        images: [
            "https://images.unsplash.com/photo-1601997387342-990422998782?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Aranmula+Parthasarathy+Temple",
        isMajorFestival: true
    },
    {
        id: "attukal-pongala",
        name: "Attukal Pongala",
        month: "February-March",
        district: "Thiruvananthapuram",
        category: "Temple Festival",
        description: "A massive women-only ritual where millions of women gather to offer pongala to the Attukal Devi, creating one of the largest congregations of women in the world.",
        highlights: [
            "Women cooking pongala in clay pots",
            "Kilometres of offerings on the streets",
            "Strong devotional atmosphere"
        ],
        mainLocation: "Attukal Bhagavathy Temple, Thiruvananthapuram",
        dateRange: "Falls during the Attukal Pongala festival, usually in Feb–Mar",
        images: [
            "https://images.unsplash.com/photo-1644318723908-1a5c60e53216?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Attukal+Temple+Thiruvananthapuram",
        isMajorFestival: true
    },
    {
        id: "theyyam-festivals",
        name: "Theyyam Festivals (Kannur Region)",
        month: "November-April",
        district: "Kannur",
        category: "Theyyam",
        description: "A striking ritual art form where performers become the embodiment of deities and ancestors, held in numerous kavus (sacred groves) across North Kerala.",
        highlights: [
            "Vibrant face painting and costumes",
            "Fire rituals and trance performances",
            "Night-long ceremonies in kavus"
        ],
        mainLocation: "Various kavus around Kannur (e.g. Parassinikadavu, Kottiyoor region)",
        dateRange: "Theyyam season runs roughly from Nov to Apr each year",
        images: [
            "https://images.unsplash.com/photo-1629217365686-22a36b539c9c?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Theyyam+festivals+Kannur",
        isMajorFestival: true
    },
    {
        id: "guruvayur-ekadasi",
        name: "Guruvayur Ekadasi",
        month: "November-December",
        district: "Thrissur",
        category: "Temple Festival",
        description: "A major religious observance at the Guruvayur Sri Krishna Temple, marked by special poojas, lamps, and a day-long fast for many devotees.",
        highlights: [
            "Special deeparadhana (lamp worship)",
            "Elephant procession",
            "Night-long prayers and rituals"
        ],
        mainLocation: "Guruvayur Sri Krishna Temple, Guruvayur",
        dateRange: "Observed on the Ekadasi day in the Malayalam month of Vrischikam",
        images: [
            "https://images.unsplash.com/photo-1605809772652-3254c7d08315?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Guruvayur+Temple+Thrissur",
        isMajorFestival: false
    },
    {
        id: "chettikulangara-bharani",
        name: "Chettikulangara Bharani",
        month: "February-March",
        district: "Alappuzha",
        category: "Temple Festival",
        description: "A vibrant temple festival at Chettikulangara Bhagavathy Temple, famous for massive Kuthiyottam performances and colourful pageantry.",
        highlights: [
            "Kuthiyottam ritual procession",
            "Decorated temple chariots",
            "Folk art performances"
        ],
        mainLocation: "Chettikulangara Bhagavathy Temple, Mavelikkara",
        dateRange: "Held on Bharani star in the Malayalam month of Kumbham",
        images: [
            "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Chettikulangara+Temple+Alappuzha",
        isMajorFestival: true
    },
    {
        id: "kodungallur-bharani",
        name: "Kodungallur Bharani",
        month: "March-April",
        district: "Thrissur",
        category: "Temple Festival",
        description: "An intense and ancient festival at Kodungallur Bhagavathy Temple with unique rituals performed by oracles known as 'Velichappads'.",
        highlights: [
            "Velichappad (oracle) rituals",
            "Devotees singing Bharani songs",
            "Ancient Dravidian-style practices"
        ],
        mainLocation: "Kodungallur Bhagavathy Temple, Kodungallur",
        dateRange: "Celebrated during the Bharani star in the Malayalam month of Meenam",
        images: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Kodungallur+Bhagavathy+Temple",
        isMajorFestival: false
    },
    {
        id: "vishu",
        name: "Vishu",
        month: "April",
        district: "Statewide",
        category: "Harvest",
        description: "The Malayalam New Year festival, celebrated with Vishukkani arrangements, firecrackers, and traditional feast.",
        highlights: [
            "Vishukkani (auspicious viewing)",
            "Firecrackers",
            "Special Vishu Sadhya",
            "Children receiving Vishukkaineetam"
        ],
        mainLocation: "Celebrated in homes and temples across Kerala",
        dateRange: "Celebrated on Medam 1 (usually 14th or 15th April)",
        images: [
            "https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Vishu+festival+Kerala",
        isMajorFestival: true
    },
    {
        id: "cochin-carnival",
        name: "Cochin Carnival",
        month: "December-January",
        district: "Ernakulam",
        category: "Cultural",
        description: "A lively year-end carnival at Fort Kochi with parades, music, competitions, and New Year celebrations.",
        highlights: [
            "Colourful street parades",
            "Music and dance performances",
            "Burning of the Pappanji effigy on New Year’s Eve"
        ],
        mainLocation: "Fort Kochi, Ernakulam",
        dateRange: "Carnival week leading up to New Year (late Dec – early Jan)",
        images: [
            "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Fort+Kochi+Cochin+Carnival",
        isMajorFestival: false
    },
    {
        id: "kalpathi-ratholsavam",
        name: "Kalpathi Ratholsavam",
        month: "November",
        district: "Palakkad",
        category: "Temple Festival",
        description: "A chariot festival in the heritage Brahmin village of Kalpathi, featuring decorated temple chariots pulled through the streets.",
        highlights: [
            "Temple chariot processions",
            "Traditional Carnatic music",
            "Heritage agraharam ambience"
        ],
        mainLocation: "Kalpathi Viswanatha Swamy Temple, Palakkad",
        dateRange: "Usually held in November over several days",
        images: [
            "https://images.unsplash.com/photo-1605809772652-3254c7d08315?q=80&w=1000&auto=format&fit=crop"
        ],
        mapsLink: "https://www.google.com/maps/search/?api=1&query=Kalpathi+Viswanatha+Swamy+Temple+Palakkad",
        isMajorFestival: false
    }
];
