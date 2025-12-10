'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase/provider';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, BedDouble, ExternalLink, Wifi, Coffee, Waves, Mountain } from 'lucide-react';
import { SaveButton } from '@/components/shared/SaveButton';
import { stays as mockStays, type Stay } from '@/lib/data/stays-data';
import Image from 'next/image';

export function StaysPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [allStays, setAllStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedStayType, setSelectedStayType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDistrict, setSelectedDistrict] = useState("All");
    const [selectedPriceRange, setSelectedPriceRange] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Demo Mode or No Firestore
                if (!user || user.uid === 'demo-user-123' || !firestore) {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setAllStays(mockStays);
                    setLoading(false);
                    return;
                }

                // Real Firestore Fetch
                const staysRef = collection(firestore, 'stays');
                const snapshot = await getDocs(staysRef);

                if (snapshot.empty) {
                    console.log("No stays found in Firestore, using mock data.");
                    setAllStays(mockStays);
                } else {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stay));
                    setAllStays(data);
                }
            } catch (err) {
                console.error("Error fetching stays data:", err);
                setError("Unable to load stays. Using offline data.");
                setAllStays(mockStays); // Fallback
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, firestore]);

    // Derived State (Filtering)
    const filteredStays = useMemo(() => {
        return allStays.filter(stay => {
            // Stay Type Filter
            if (selectedStayType !== "All" && stay.stayType !== selectedStayType) return false;

            // Category Filter
            if (selectedCategory !== "All" && stay.category !== selectedCategory) return false;

            // District Filter
            if (selectedDistrict !== "All" && stay.district !== selectedDistrict) return false;

            // Price Range Filter
            if (selectedPriceRange !== "All") {
                const price = stay.price || 0;
                if (selectedPriceRange === "Under ₹5,000" && price >= 5000) return false;
                if (selectedPriceRange === "₹5,000 - ₹10,000" && (price < 5000 || price > 10000)) return false;
                if (selectedPriceRange === "₹10,000 - ₹20,000" && (price < 10000 || price > 20000)) return false;
                if (selectedPriceRange === "Above ₹20,000" && price <= 20000) return false;
            }

            // Search Filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchesName = stay.name.toLowerCase().includes(term);
                const matchesDistrict = stay.district.toLowerCase().includes(term);
                const matchesHighlight = stay.highlight.toLowerCase().includes(term);
                if (!matchesName && !matchesDistrict && !matchesHighlight) return false;
            }

            return true;
        });
    }, [allStays, selectedStayType, selectedCategory, selectedDistrict, selectedPriceRange, searchTerm]);

    // Unique Districts for Dropdown
    const districts = useMemo(() => {
        const unique = new Set(allStays.map(s => s.district));
        return ["All", ...Array.from(unique).sort()];
    }, [allStays]);

    const stayTypes = ["All", "Hotel", "Resort", "Homestay", "Houseboat"];
    const categories = ["All", "Luxury", "Budget", "Beachside", "Hill Station", "Backwater", "Nature", "Heritage"];
    const priceRanges = ["All", "Under ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹20,000", "Above ₹20,000"];

    // Helper to get icon for amenity (simple mapping)
    const getAmenityIcon = (amenity: string) => {
        const lower = amenity.toLowerCase();
        if (lower.includes('wifi')) return <Wifi className="h-3 w-3" />;
        if (lower.includes('pool')) return <Waves className="h-3 w-3" />;
        if (lower.includes('breakfast') || lower.includes('food')) return <Coffee className="h-3 w-3" />;
        if (lower.includes('view') || lower.includes('nature')) return <Mountain className="h-3 w-3" />;
        return <BedDouble className="h-3 w-3" />;
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2000&auto=format&fit=crop"
                        alt="Kerala Stays Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container relative z-10 px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
                        Stay in Kerala, Your Way
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 drop-shadow-md">
                        Find the perfect resort, hotel, homestay, or houseboat for your magical Kerala trip.
                    </p>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-4 shadow-sm -mt-8 mx-4 md:mx-auto max-w-6xl rounded-xl border border-border/50">
                <div className="px-4 md:px-6">
                    <div className="flex flex-col gap-4">

                        {/* Top Row: Search & District */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative w-full md:w-1/2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, district or highlight..."
                                    className="pl-9 rounded-full bg-secondary/50 border-transparent focus:bg-background transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger className="w-[160px] rounded-full border-primary/20">
                                        <SelectValue placeholder="District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map(d => (
                                            <SelectItem key={d} value={d}>{d === "All" ? "All Districts" : d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[160px] rounded-full border-primary/20">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                                    <SelectTrigger className="w-[160px] rounded-full border-primary/20">
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priceRanges.map(p => (
                                            <SelectItem key={p} value={p}>{p === "All" ? "All Prices" : p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Bottom Row: Stay Type Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
                            {stayTypes.map(type => (
                                <Button
                                    key={type}
                                    variant={selectedStayType === type ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedStayType(type)}
                                    className="rounded-full whitespace-nowrap px-6"
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-headline text-primary">Recommended Stays</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground text-sm">{filteredStays.length} results found</span>
                        {/* Dev Tool: Upload Data */}
                        {user && user.uid !== 'demo-user-123' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    if (!firestore) return;
                                    if (!confirm('Upload all mock stays to Firestore? This will overwrite existing data.')) return;

                                    try {
                                        const { writeBatch, doc } = await import('firebase/firestore');
                                        const batch = writeBatch(firestore);

                                        mockStays.forEach(stay => {
                                            const ref = doc(firestore, 'stays', stay.id);
                                            batch.set(ref, stay);
                                        });

                                        await batch.commit();
                                        alert('Successfully uploaded ' + mockStays.length + ' stays to Firestore!');
                                        window.location.reload();
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Upload failed: ' + err.message);
                                    }
                                }}
                            >
                                Seed DB
                            </Button>
                        )}
                    </div>
                </div>

                {/* Data Update Banner - Shows if user has very few items (likely old data) */}
                {!loading && allStays.length < 10 && user && user.uid !== 'demo-user-123' && (
                    <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/20 rounded-full text-primary">
                                <ExternalLink className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary">New Stays Data Available!</h3>
                                <p className="text-muted-foreground">
                                    It looks like you have an older version of the database with only {allStays.length} items.
                                    We have a new dataset with 30+ premium stays ready for you.
                                </p>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="whitespace-nowrap shadow-lg animate-pulse"
                            onClick={async () => {
                                if (!firestore) return;
                                try {
                                    const { writeBatch, doc } = await import('firebase/firestore');
                                    const batch = writeBatch(firestore);

                                    mockStays.forEach(stay => {
                                        const ref = doc(firestore, 'stays', stay.id);
                                        batch.set(ref, stay);
                                    });

                                    await batch.commit();
                                    alert('Success! Database updated with ' + mockStays.length + ' stays.');
                                    window.location.reload();
                                } catch (err: any) {
                                    console.error(err);
                                    alert('Update failed: ' + err.message);
                                }
                            }}
                        >
                            Update Database Now
                        </Button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] rounded-2xl bg-muted/20 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-destructive mb-2">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredStays.length === 0 ? (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
                        <BedDouble className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No stays match your filters</h3>
                        <p className="text-muted-foreground mb-4">Try changing the stay type, district, or search term.</p>
                        <Button variant="link" onClick={() => {
                            setSelectedStayType("All");
                            setSelectedCategory("All");
                            setSelectedDistrict("All");
                            setSelectedPriceRange("All");
                            setSearchTerm("");
                        }}>Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStays.map(stay => (
                            <Card key={stay.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-2xl bg-card">
                                {/* Image Area */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={stay.imageUrl}
                                        alt={stay.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                                    {/* Save Button */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <SaveButton
                                            item={{
                                                id: stay.id,
                                                name: stay.name,
                                                district: stay.district,
                                                imageId: stay.imageId || 'stay-default',
                                                description: stay.stayType,
                                                location: stay.district
                                            }}
                                            itemType="accommodation"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {stay.isFeatured && (
                                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black border-none shadow-sm">
                                                Featured
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="backdrop-blur-md bg-white/30 text-white border-none w-fit">
                                            {stay.stayType}
                                        </Badge>
                                    </div>

                                    {/* Bottom Info Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-medium text-white/90 mb-1 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {stay.district}
                                                </p>
                                                <h3 className="font-headline text-2xl font-bold leading-tight shadow-black drop-shadow-md">{stay.name}</h3>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold border border-white/30">
                                                ★ {stay.rating}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="flex-1 p-5 flex flex-col gap-4">
                                    {/* Highlight */}
                                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                                        "{stay.highlight}"
                                    </p>

                                    {/* Meta Row */}
                                    <div className="flex items-center justify-between text-sm">
                                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                                            {stay.category}
                                        </Badge>
                                        <span className="font-semibold text-foreground">
                                            {stay.price
                                                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stay.price)
                                                : stay.priceRange}
                                        </span>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2">
                                        {stay.amenities.slice(0, 4).map(amenity => (
                                            <div key={amenity} className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                                                {getAmenityIcon(amenity)}
                                                {amenity}
                                            </div>
                                        ))}
                                        {stay.amenities.length > 4 && (
                                            <span className="text-xs text-muted-foreground self-center">+{stay.amenities.length - 4} more</span>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span className="text-xs">Check-in Info</span>
                                            </div>
                                            <span className="text-xs font-medium truncate max-w-[150px]">{stay.openingHours || "Contact for times"}</span>
                                        </div>

                                        <Button variant="ghost" size="sm" className="h-9 gap-1 text-primary hover:text-primary hover:bg-primary/10 group/btn" asChild>
                                            <a href={stay.mapsLink} target="_blank" rel="noopener noreferrer">
                                                View Map <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
                }
            </section >
        </div >
    );
}
