'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase/provider';
import { galleryImages as mockImages, type GalleryImage } from '@/lib/data/gallery-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, MapPin, X, ExternalLink, Loader2, Camera, Filter } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

export default function GalleryPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allImages, setAllImages] = useState<GalleryImage[]>([]);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    // Fetch Gallery
    useEffect(() => {
        async function fetchGallery() {
            setLoading(true);
            try {
                // Demo Mode or No Firestore
                if (!user || user.uid === 'demo-user-123' || !firestore) {
                    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                    setAllImages(mockImages);
                    setLoading(false);
                    return;
                }

                const ref = collection(firestore, 'gallery');
                const snapshot = await getDocs(ref);

                if (snapshot.empty) {
                    console.log("No gallery images found in Firestore, using mock data.");
                    setAllImages(mockImages);
                } else {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
                    setAllImages(data);
                }
            } catch (err) {
                console.error("Error fetching gallery:", err);
                setError("Unable to load gallery. Please try again.");
                setAllImages(mockImages); // Fallback
            } finally {
                setLoading(false);
            }
        }

        fetchGallery();
    }, [user, firestore]);

    // Filter Logic
    const filteredImages = useMemo(() => {
        return allImages.filter(img => {
            // Category Filter
            const categoryMatch = selectedCategory === "All" || img.category === selectedCategory;

            // District Filter
            const districtMatch = selectedDistrict === "All Districts" || img.district === selectedDistrict;

            // Search Filter
            const searchLower = searchTerm.toLowerCase();
            const searchMatch = !searchTerm ||
                img.title.toLowerCase().includes(searchLower) ||
                img.locationName.toLowerCase().includes(searchLower) ||
                (img.tags && img.tags.some(tag => tag.toLowerCase().includes(searchLower)));

            return categoryMatch && districtMatch && searchMatch;
        });
    }, [allImages, selectedCategory, selectedDistrict, searchTerm]);

    // Featured Images
    const featuredImages = useMemo(() => allImages.filter(img => img.isFeatured), [allImages]);

    // Derived Lists
    const districts = Array.from(new Set(allImages.map(img => img.district))).sort();
    const categories = ["All", "Beach", "Backwaters", "Hill Station", "Wildlife", "Culture", "Festivals", "Food", "Cityscape"];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop"
                    alt="Kerala Gallery"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl text-white space-y-4 animate-in slide-in-from-left duration-700">
                            <Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-sm font-medium mb-2">
                                Photo Gallery
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
                                Kerala in Pictures
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                                Browse stunning photos of beaches, backwaters, hills, wildlife, culture and food across Kerala.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Strip */}
            {featuredImages.length > 0 && (
                <section className="py-8 bg-muted/30 border-b">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6 font-headline flex items-center gap-2">
                            <Camera className="h-6 w-6 text-primary" />
                            Featured Moments
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {featuredImages.map(img => (
                                <div
                                    key={img.id}
                                    className="relative flex-shrink-0 w-[300px] h-[200px] rounded-xl overflow-hidden cursor-pointer group snap-center shadow-md hover:shadow-xl transition-all duration-300"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-white font-bold text-lg truncate">{img.title}</h3>
                                        <p className="text-gray-300 text-xs truncate">{img.locationName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters Bar */}
            <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b shadow-sm py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, location or tags..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Dropdowns */}
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger className="w-[180px]">
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
                {/* Data Update Banner */}
                {!loading && allImages.length < 5 && user && user.uid !== 'demo-user-123' && (
                    <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/20 rounded-full text-primary">
                                <ExternalLink className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary">Initialize Gallery Database</h3>
                                <p className="text-muted-foreground">
                                    Your gallery seems empty. Click to upload the default set of images.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={async () => {
                                if (!firestore) return;
                                if (!confirm('Upload gallery images to Firestore?')) return;
                                try {
                                    const { writeBatch, doc } = await import('firebase/firestore');
                                    const batch = writeBatch(firestore);
                                    mockImages.forEach(img => {
                                        const ref = doc(firestore, 'gallery', img.id);
                                        batch.set(ref, img);
                                    });
                                    await batch.commit();
                                    alert('Gallery uploaded!');
                                    window.location.reload();
                                } catch (e: any) {
                                    alert('Error: ' + e.message);
                                }
                            }}
                        >
                            Seed Gallery DB
                        </Button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground text-lg">Loading gallery...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-destructive text-lg mb-4">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No images match your filters</h3>
                        <p className="text-muted-foreground mb-4">Try a different category or district.</p>
                        <Button variant="link" onClick={() => {
                            setSelectedCategory("All");
                            setSelectedDistrict("All Districts");
                            setSearchTerm("");
                        }}>Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredImages.map(img => (
                            <div
                                key={img.id}
                                className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-muted"
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img.thumbnailUrl || img.imageUrl}
                                    alt={img.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{img.title}</h3>
                                    <p className="text-gray-300 text-xs flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {img.district}
                                    </p>
                                </div>

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-sm">
                                        {img.category}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Lightbox Modal */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-black/95 border-none text-white">
                    <div className="relative w-full h-full flex flex-col md:flex-row">
                        {/* Image Container */}
                        <div className="relative flex-1 h-[50vh] md:h-full bg-black flex items-center justify-center">
                            {selectedImage && (
                                <Image
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                            <DialogClose className="absolute top-4 right-4 md:hidden z-50 p-2 bg-black/50 rounded-full text-white">
                                <X className="h-5 w-5" />
                            </DialogClose>
                        </div>

                        {/* Details Sidebar */}
                        {selectedImage && (
                            <div className="w-full md:w-[350px] lg:w-[400px] h-auto md:h-full bg-zinc-900 p-6 flex flex-col overflow-y-auto border-l border-zinc-800">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground mb-3">
                                            {selectedImage.category}
                                        </Badge>
                                        <h2 className="text-2xl font-bold font-headline leading-tight mb-2">
                                            {selectedImage.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                            <MapPin className="h-4 w-4" />
                                            <span>{selectedImage.district}</span>
                                        </div>
                                    </div>
                                    <DialogClose className="hidden md:block p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="h-5 w-5" />
                                    </DialogClose>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Description</h4>
                                        <p className="text-zinc-300 leading-relaxed">
                                            {selectedImage.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Location</h4>
                                        <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg">
                                            <span className="font-medium">{selectedImage.locationName}</span>
                                            <a
                                                href={selectedImage.mapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                                            >
                                                View Map
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </div>

                                    {selectedImage.tags && (
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedImage.tags.map(tag => (
                                                    <span key={tag} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <Camera className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">Photographer</p>
                                            <p className="text-sm font-medium">{selectedImage.photographer || 'Unknown'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
