'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase/provider';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Clock, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { SaveButton } from '@/components/shared/SaveButton';
import { diningPlaces as mockDiningPlaces, type DiningPlace } from '@/lib/data/dining-data';
import Image from 'next/image';

export function DiningPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [allDining, setAllDining] = useState<DiningPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDistrict, setSelectedDistrict] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [vegOnly, setVegOnly] = useState(false);

    // Fetch Data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Demo Mode or No Firestore
                if (!user || user.uid === 'demo-user-123' || !firestore) {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setAllDining(mockDiningPlaces);
                    setLoading(false);
                    return;
                }

                // Real Firestore Fetch
                const diningRef = collection(firestore, 'dining');
                const snapshot = await getDocs(diningRef);

                if (snapshot.empty) {
                    // Fallback to mock data if DB is empty so page isn't blank
                    console.log("No dining data found in Firestore, using mock data.");
                    setAllDining(mockDiningPlaces);
                } else {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiningPlace));
                    setAllDining(data);
                }
            } catch (err) {
                console.error("Error fetching dining data:", err);
                setError("Unable to load dining options. Using offline data.");
                setAllDining(mockDiningPlaces); // Fallback
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, firestore]);

    // Derived State (Filtering)
    const filteredDining = useMemo(() => {
        return allDining.filter(place => {
            // Category Filter
            if (selectedCategory !== "All" && place.category !== selectedCategory) return false;

            // District Filter
            if (selectedDistrict !== "All" && place.district !== selectedDistrict) return false;

            // Veg Only Filter
            if (vegOnly && !place.vegOnly) return false;

            // Search Filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchesName = place.name.toLowerCase().includes(term);
                const matchesCuisine = place.cuisine.some(c => c.toLowerCase().includes(term));
                if (!matchesName && !matchesCuisine) return false;
            }

            return true;
        });
    }, [allDining, selectedCategory, selectedDistrict, vegOnly, searchTerm]);

    // Unique Districts for Dropdown
    const districts = useMemo(() => {
        const unique = new Set(allDining.map(p => p.district));
        return ["All", ...Array.from(unique).sort()];
    }, [allDining]);

    const categories = ["All", "Traditional", "Seafood", "Vegetarian", "Luxury", "Street Food", "Cafe"];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary/5 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
                        Discover Kerala's Flavours 🍛
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From spicy Malabar biryanis to fresh seafood and traditional sadhyas, find the best culinary experiences Kerala has to offer.
                    </p>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                        {/* Search */}
                        <div className="relative w-full lg:w-1/3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or cuisine..."
                                className="pl-9 rounded-full bg-secondary/50 border-transparent focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters Group */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">

                            {/* District Select */}
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-[140px] rounded-full border-primary/20">
                                    <SelectValue placeholder="District" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map(d => (
                                        <SelectItem key={d} value={d}>{d === "All" ? "All Districts" : d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Veg Toggle */}
                            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-2 rounded-full border border-transparent hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => setVegOnly(!vegOnly)}>
                                <Switch checked={vegOnly} onCheckedChange={setVegOnly} id="veg-mode" />
                                <Label htmlFor="veg-mode" className="cursor-pointer text-sm font-medium text-green-700 dark:text-green-400">Veg Only 🌿</Label>
                            </div>
                        </div>
                    </div>

                    {/* Category Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mt-4 no-scrollbar mask-linear-fade">
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className="rounded-full whitespace-nowrap"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="container mx-auto px-4 py-8 md:py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[400px] rounded-xl bg-muted/20 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-destructive mb-2">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredDining.length === 0 ? (
                    <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                        <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No dining places found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                        <Button variant="link" onClick={() => {
                            setSelectedCategory("All");
                            setSelectedDistrict("All");
                            setSearchTerm("");
                            setVegOnly(false);
                        }}>Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredDining.map(place => (
                            <Card key={place.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                {/* Image Area */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={place.imageUrl}
                                        alt={place.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                    {/* Save Button */}
                                    <div className="absolute top-3 right-3">
                                        <SaveButton
                                            item={{
                                                id: place.id,
                                                name: place.name,
                                                district: place.district,
                                                imageId: place.imageId || 'dining-default',
                                                description: place.category,
                                                location: place.district
                                            }}
                                            itemType="dining"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                                        <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                                            {place.category}
                                        </Badge>
                                        <Badge variant="secondary" className="backdrop-blur-sm bg-black/40 text-white border-none">
                                            {place.priceRange}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="flex-1 p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{place.name}</h3>
                                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {place.district}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-sm font-bold">
                                            ★ {place.rating}
                                        </div>
                                    </div>

                                    {/* Signature Dishes */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {place.signatureDishes.slice(0, 3).map(dish => (
                                            <span key={dish} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                                                {dish}
                                            </span>
                                        ))}
                                        {place.signatureDishes.length > 3 && (
                                            <span className="text-xs text-muted-foreground">+{place.signatureDishes.length - 3} more</span>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span className="truncate max-w-[120px]">{place.openingHours}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10" asChild>
                                            <a href={place.mapsLink} target="_blank" rel="noopener noreferrer">
                                                View Map <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
