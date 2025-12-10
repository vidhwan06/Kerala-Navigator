'use client';

import { useUser, useFirestore } from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function ItinerariesPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
            return;
        }

        if (!user || !firestore) return;

        // Fetch saved itineraries
        const qItineraries = query(collection(firestore, `users/${user.uid}/itineraries`));
        const unsubscribeItineraries = onSnapshot(qItineraries, (snapshot) => {
            const itineraries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedItineraries(itineraries);
            setLoading(false);
        });

        return () => {
            unsubscribeItineraries();
        };
    }, [user, isUserLoading, firestore, router]);

    if (isUserLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Itineraries</h1>
                <Button asChild>
                    <Link href="/itinerary-planner">Create New Itinerary</Link>
                </Button>
            </div>

            {savedItineraries.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Saved Itineraries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No saved itineraries found. Plan your first trip today!</p>
                    </CardContent>
                </Card>
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
        </div>
    );
}
