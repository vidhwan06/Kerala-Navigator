'use client';

import { useUser, useFirestore } from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Item } from '@/lib/data';

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [loadingItineraries, setLoadingItineraries] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
            return;
        }

        if (!user || !firestore) return;

        // Fetch saved items
        const qItems = query(collection(firestore, `users/${user.uid}/saved`));
        const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedItems(items);
            setLoadingItems(false);
        });

        // Fetch saved itineraries
        const qItineraries = query(collection(firestore, `users/${user.uid}/itineraries`));
        const unsubscribeItineraries = onSnapshot(qItineraries, (snapshot) => {
            const itineraries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedItineraries(itineraries);
            setLoadingItineraries(false);
        });

        return () => {
            unsubscribeItems();
            unsubscribeItineraries();
        };
    }, [user, isUserLoading, firestore, router]);

    if (isUserLoading || (loadingItems && loadingItineraries)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const attractions = savedItems.filter(item => item.itemType === 'attraction');
    const accommodations = savedItems.filter(item => item.itemType === 'accommodation');
    const dining = savedItems.filter(item => item.itemType === 'dining');

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-headline font-bold mb-2">My Profile</h1>
                <p className="text-muted-foreground">Manage your saved trips and favorite places.</p>
            </div>

            <Tabs defaultValue="places" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="places" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Saved Places
                    </TabsTrigger>
                    <TabsTrigger value="itineraries" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Itineraries
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="places" className="space-y-8">
                    {savedItems.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                            <p className="text-muted-foreground">You haven't saved any places yet.</p>
                        </div>
                    ) : (
                        <>
                            {attractions.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">Attractions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {attractions.map((item) => (
                                            <InfoCard key={item.id} item={item as Item} itemType="attraction" />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {accommodations.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4 mt-8">Accommodations</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {accommodations.map((item) => (
                                            <InfoCard key={item.id} item={item as Item} itemType="accommodation" />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {dining.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4 mt-8">Dining</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {dining.map((item) => (
                                            <InfoCard key={item.id} item={item as Item} itemType="dining" />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="itineraries">
                    {savedItineraries.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                            <p className="text-muted-foreground">You haven't saved any itineraries yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {savedItineraries.map((itinerary) => (
                                <Card key={itinerary.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            {itinerary.name}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            Created on {itinerary.createdAt ? new Date(itinerary.createdAt).toLocaleDateString() : 'Unknown date'}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">
                                            {itinerary.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
