'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase/provider';
import { festivals as mockFestivals, type Festival } from '@/lib/data/festivals-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Calendar, Heart, Filter, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function FestivalsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allFestivals, setAllFestivals] = useState<Festival[]>([]);

    // Filters
    const [selectedMonth, setSelectedMonth] = useState("All Months");
    const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Saved items tracking
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    // Fetch Festivals
    useEffect(() => {
        async function fetchFestivals() {
            setLoading(true);
            try {
                // Demo Mode or No Firestore
                if (!user || user.uid === 'demo-user-123' || !firestore) {
                    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                    setAllFestivals(mockFestivals);
                    setLoading(false);
                    return;
                }

                const ref = collection(firestore, 'festivals');
                const snapshot = await getDocs(ref);

                if (snapshot.empty) {
                    console.log("No festivals found in Firestore, using mock data.");
                    setAllFestivals(mockFestivals);
                } else {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Festival));
                    setAllFestivals(data);
                }
            } catch (err) {
                console.error("Error fetching festivals:", err);
                setError("Unable to load festivals right now. Please try again.");
                setAllFestivals(mockFestivals); // Fallback
            } finally {
                setLoading(false);
            }
        }

        fetchFestivals();
    }, [user, firestore]);

    // Listen for Saved Items
    useEffect(() => {
        if (!user || !firestore || user.uid === 'demo-user-123') {
            setSavedIds(new Set());
            return;
        }

        const savedRef = collection(firestore, `users/${user.uid}/savedItems`);
        const unsubscribe = onSnapshot(savedRef, (snapshot) => {
            const ids = new Set(snapshot.docs
                .filter(doc => doc.data().type === 'festival')
                .map(doc => doc.data().refId));
            setSavedIds(ids);
        });

        return () => unsubscribe();
    }, [user, firestore]);

    // Filter Logic
    const filteredFestivals = useMemo(() => {
        return allFestivals.filter(festival => {
            // Month Filter
            const monthMatch = selectedMonth === "All Months" ||
                festival.month.toLowerCase().includes(selectedMonth.toLowerCase()) ||
                festival.dateRange.toLowerCase().includes(selectedMonth.toLowerCase());

            // District Filter
            const districtMatch = selectedDistrict === "All Districts" || festival.district === selectedDistrict;

            // Category Filter
            const categoryMatch = selectedCategory === "All" || festival.category === selectedCategory;

            // Search Filter
            const searchMatch = !searchTerm ||
                festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                festival.district.toLowerCase().includes(searchTerm.toLowerCase());

            return monthMatch && districtMatch && categoryMatch && searchMatch;
        });
    }, [allFestivals, selectedMonth, selectedDistrict, selectedCategory, searchTerm]);

    // Handle Save
    const handleSave = async (festival: Festival) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.uid === 'demo-user-123') {
            toast({
                title: "Demo Mode",
                description: "Saving is disabled in demo mode.",
            });
            return;
        }

        if (!firestore) return;

        try {
            if (savedIds.has(festival.id)) {
                // Find the doc to delete (inefficient but works for this schema)
                // Ideally we'd store the docId, but the prompt schema doesn't mandate it.
                // We'll query for it.
                const savedRef = collection(firestore, `users/${user.uid}/savedItems`);
                const snapshot = await getDocs(savedRef);
                const docToDelete = snapshot.docs.find(d => d.data().refId === festival.id && d.data().type === 'festival');

                if (docToDelete) {
                    await deleteDoc(doc(firestore, `users/${user.uid}/savedItems`, docToDelete.id));
                    toast({ title: "Removed from trip" });
                }
            } else {
                await addDoc(collection(firestore, "users", user.uid, "savedItems"), {
                    type: "festival",
                    refId: festival.id,
                    name: festival.name,
                    district: festival.district,
                    addedAt: serverTimestamp()
                });
                toast({ title: "Festival saved to your trip dashboard!" });
            }
        } catch (err) {
            console.error("Error saving festival:", err);
            toast({
                title: "Error",
                description: "Could not save festival.",
                variant: "destructive"
            });
        }
    };

    // Derived Lists for Dropdowns
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const districts = Array.from(new Set(allFestivals.map(f => f.district))).sort();
    const categories = ["All", "Temple Festival", "Boat Race", "Harvest", "Theyyam", "Cultural"];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2000&auto=format&fit=crop"
                    alt="Kerala Festivals"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl text-white space-y-4 animate-in slide-in-from-left duration-700">
                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-none px-3 py-1 text-sm font-medium mb-2">
                                Cultural Calendar
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
                                Festivals & Celebrations of Kerala
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                                Experience temple festivals, boat races, Theyyam rituals and Onam celebrations across God's Own Country.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b shadow-sm py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by festival name or district..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Dropdowns */}
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All Months">All Months</SelectItem>
                                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All Districts">All Districts</SelectItem>
                                        {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
                                        selectedCategory === cat
                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-12">
                {/* Data Update Banner (Same as StaysPage) */}
                {!loading && allFestivals.length < 5 && user && user.uid !== 'demo-user-123' && (
                    <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/20 rounded-full text-primary">
                                <ExternalLink className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary">Initialize Festivals Database</h3>
                                <p className="text-muted-foreground">
                                    Your database seems empty. Click to upload the default list of festivals.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={async () => {
                                if (!firestore) return;
                                if (!confirm('Upload festivals to Firestore?')) return;
                                try {
                                    const { writeBatch, doc } = await import('firebase/firestore');
                                    const batch = writeBatch(firestore);
                                    mockFestivals.forEach(f => {
                                        const ref = doc(firestore, 'festivals', f.id);
                                        batch.set(ref, f);
                                    });
                                    await batch.commit();
                                    alert('Festivals uploaded!');
                                    window.location.reload();
                                } catch (e: any) {
                                    alert('Error: ' + e.message);
                                }
                            }}
                        >
                            Seed Festivals DB
                        </Button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground text-lg">Loading festivals & events...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-destructive text-lg mb-4">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredFestivals.length === 0 ? (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No festivals match your filters</h3>
                        <p className="text-muted-foreground mb-4">Try a different month or district.</p>
                        <Button variant="link" onClick={() => {
                            setSelectedMonth("All Months");
                            setSelectedDistrict("All Districts");
                            setSelectedCategory("All");
                            setSearchTerm("");
                        }}>Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFestivals.map(festival => (
                            <Card key={festival.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-2xl bg-card">
                                {/* Image */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={festival.images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                                        alt={festival.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {festival.isMajorFestival && (
                                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-none w-fit">
                                                Major Festival
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="backdrop-blur-md bg-black/30 text-white border-none w-fit">
                                            {festival.category}
                                        </Badge>
                                    </div>

                                    {/* Save Button */}
                                    <div className="absolute top-4 right-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 text-white",
                                                savedIds.has(festival.id) && "text-red-500 hover:text-red-600 bg-white/90 hover:bg-white"
                                            )}
                                            onClick={() => handleSave(festival)}
                                        >
                                            <Heart className={cn("h-5 w-5", savedIds.has(festival.id) && "fill-current")} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold font-headline mb-1 group-hover:text-primary transition-colors">
                                            {festival.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{festival.district}</span>
                                            <span className="text-border">|</span>
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{festival.month}</span>
                                        </div>
                                        <p className="text-xs font-medium text-primary/80 bg-primary/5 px-2 py-1 rounded-md w-fit">
                                            {festival.dateRange}
                                        </p>
                                    </div>

                                    {/* Highlights */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {festival.highlights.slice(0, 2).map((highlight, idx) => (
                                            <span key={idx} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-sm">
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {festival.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                        <div className="flex flex-col w-full">
                                            <span className="text-xs text-muted-foreground">Location</span>
                                            <span className="text-sm font-medium truncate" title={festival.mainLocation}>
                                                {festival.mainLocation}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
