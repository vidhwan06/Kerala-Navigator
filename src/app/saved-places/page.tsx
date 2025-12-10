'use client';

import { useUser, useFirestore } from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InfoCard } from '@/components/shared/InfoCard';
import type { Item } from '@/lib/data';

export default function SavedPlacesPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
            return;
        }

        if (!user || !firestore) return;

        // Fetch saved items
        const qItems = query(collection(firestore, `users/${user.uid}/saved`));
        const unsubscribe = onSnapshot(qItems, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedItems(items);
            setLoading(false);
        });

        return () => {
            unsubscribe();
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
            <h1 className="text-3xl font-bold mb-6">Saved Places</h1>

            {savedItems.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Saved Destinations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You haven't saved any places yet. Start exploring to add favorites!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((item) => (
                        <InfoCard
                            key={item.id}
                            item={item as Item}
                            itemType={item.type ? item.type.toLowerCase() as any : 'attraction'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
