'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase/provider';
import { collection, query, orderBy, limit, onSnapshot, type DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Heart, Clock, Plus, Compass, LayoutGrid, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Types
interface Trip {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    startingDistrict?: string;
}

interface SavedItem {
    id: string;
    type: string;
    name: string;
    district: string;
    addedAt: any;
}

interface RecentView {
    id: string;
    type: string;
    name: string;
    district: string;
    viewedAt: any;
}

export function TripDashboard() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [recentViews, setRecentViews] = useState<RecentView[]>([]);

    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loadingSaved, setLoadingSaved] = useState(true);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isUserLoading) return;

        if (!user) {
            setLoadingTrips(false);
            setLoadingSaved(false);
            setLoadingRecent(false);
            return;
        }

        // DEMO MODE HANDLING
        if (user.uid === 'demo-user-123') {
            setTrips([
                { id: '1', title: 'Backwaters Bliss', startDate: new Date(Date.now() + 86400000 * 5).toISOString(), endDate: new Date(Date.now() + 86400000 * 8).toISOString(), startingDistrict: 'Alappuzha' },
                { id: '2', title: 'Munnar Mist', startDate: new Date(Date.now() + 86400000 * 20).toISOString(), endDate: new Date(Date.now() + 86400000 * 23).toISOString(), startingDistrict: 'Idukki' }
            ]);
            setSavedItems([
                { id: '1', type: 'ATTRACTION', name: 'Alleppey Lighthouse', district: 'Alappuzha', addedAt: new Date().toISOString() },
                { id: '2', type: 'DINING', name: 'Fort Kochi Seafood', district: 'Ernakulam', addedAt: new Date().toISOString() }
            ]);
            setRecentViews([
                { id: '1', type: 'ATTRACTION', name: 'Munnar Tea Gardens', district: 'Idukki', viewedAt: new Date().toISOString() },
                { id: '2', type: 'HOTEL', name: 'Taj Malabar', district: 'Ernakulam', viewedAt: new Date().toISOString() }
            ]);
            setLoadingTrips(false);
            setLoadingSaved(false);
            setLoadingRecent(false);
            return;
        }

        if (!firestore) {
            setError("Database connection unavailable.");
            setLoadingTrips(false);
            setLoadingSaved(false);
            setLoadingRecent(false);
            return;
        }

        setError(null);

        // A) Upcoming Trips
        const tripsRef = collection(firestore, `users/${user.uid}/trips`);
        const tripsQuery = query(tripsRef, orderBy('startDate', 'asc'), limit(5));

        const unsubscribeTrips = onSnapshot(tripsQuery, (snapshot) => {
            const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
            setTrips(tripsData);
            setLoadingTrips(false);
        }, (err) => {
            console.error("Error fetching trips:", err);
            setLoadingTrips(false);
        });

        // B) Saved Items
        const savedRef = collection(firestore, `users/${user.uid}/saved`);
        const savedQuery = query(savedRef, orderBy('addedAt', 'desc'), limit(5));

        const unsubscribeSaved = onSnapshot(savedQuery, (snapshot) => {
            const savedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedItem));
            setSavedItems(savedData);
            setLoadingSaved(false);
        }, (err) => {
            console.error("Error fetching saved items:", err);
            setLoadingSaved(false);
        });

        // C) Recent Views
        const recentRef = collection(firestore, `users/${user.uid}/recentViews`);
        const recentQuery = query(recentRef, orderBy('viewedAt', 'desc'), limit(5));

        const unsubscribeRecent = onSnapshot(recentQuery, (snapshot) => {
            const recentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecentView));
            setRecentViews(recentData);
            setLoadingRecent(false);
        }, (err) => {
            console.error("Error fetching recent views:", err);
            setLoadingRecent(false);
        });

        return () => {
            unsubscribeTrips();
            unsubscribeSaved();
            unsubscribeRecent();
        };
    }, [user, isUserLoading, firestore]);

    // Auth Loading State
    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not Logged In State
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-headline font-bold mb-4">Please log in to view your dashboard.</h2>
                <p className="text-muted-foreground mb-8">Access your trips, saved places, and more.</p>
                <Button onClick={() => router.push('/login')} size="lg" className="rounded-full">
                    Go to Login
                </Button>
            </div>
        );
    }

    const getRoute = (type: string, id: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType === 'attraction') return `/attractions/${id}`;
        if (lowerType === 'dining') return `/dining/${id}`;
        if (lowerType === 'accommodation' || lowerType === 'hotel') return `/accommodations/${id}`;
        return '#';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-12">

            {/* 1. Welcome Header */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-4">
                    {user.photoURL ? (
                        <Image
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            width={64}
                            height={64}
                            className="rounded-full border-2 border-primary/20"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/20">
                            {(user.displayName || "T").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                            Welcome, {user.displayName?.split(' ')[0] || "Traveller"} 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Plan, save and revisit your Kerala journeys in one place.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button onClick={() => router.push('/create-trip')} className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-md transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Start New Trip
                    </Button>
                    <Button onClick={() => router.push('/trips')} variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                        <LayoutGrid className="mr-2 h-4 w-4" /> View All Trips
                    </Button>
                    <Button onClick={() => router.push('/attractions')} variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                        <Compass className="mr-2 h-4 w-4" /> Explore Attractions
                    </Button>
                </div>
            </section>

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20 text-sm">
                    {error}
                </div>
            )}

            {/* 2. Upcoming Trips Section */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" /> Upcoming Trips
                    </h2>
                </div>

                {loadingTrips ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="h-40 bg-muted/20 animate-pulse border-primary/5" />
                        ))}
                    </div>
                ) : trips.length === 0 ? (
                    <Card className="bg-muted/30 border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-lg font-medium text-muted-foreground mb-4">No trips yet. Start planning your first Kerala trip!</p>
                            <Button onClick={() => router.push('/create-trip')} variant="secondary" className="rounded-full">
                                Start New Trip
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <Card key={trip.id} className="group hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                                        {trip.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {format(new Date(trip.startDate), 'd MMM yyyy')} – {format(new Date(trip.endDate), 'd MMM yyyy')}
                                        </span>
                                    </div>
                                    {trip.startingDistrict && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>Starts in {trip.startingDistrict}</span>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => router.push(`/trips/${trip.id}`)}
                                        variant="ghost"
                                        className="w-full justify-between hover:bg-primary/5 hover:text-primary group/btn"
                                    >
                                        View Details
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 3. Saved Places Section */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                        <Heart className="h-6 w-6 text-accent" /> Saved Places
                    </h2>

                    {loadingSaved ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : savedItems.length === 0 ? (
                        <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed">
                            <p className="text-muted-foreground">You haven't saved any places yet. Explore attractions, dining, and stays to bookmark them here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => router.push(getRoute(item.type, item.id))}
                                >
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground uppercase tracking-wider">
                                                {item.type}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground truncate">{item.district}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 4. Recently Viewed Section */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                        <Clock className="h-6 w-6 text-secondary-foreground" /> Recently Viewed
                    </h2>

                    {loadingRecent ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : recentViews.length === 0 ? (
                        <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed">
                            <p className="text-muted-foreground">No recent views yet. Start exploring Kerala!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentViews.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => router.push(getRoute(item.type, item.id))}
                                >
                                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground group-hover:bg-secondary-foreground group-hover:text-secondary transition-colors">
                                        <Compass className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                                                {item.type}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground truncate">{item.district}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
