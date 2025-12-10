'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase/provider';
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Item } from '@/lib/data';

interface SaveButtonProps {
    item: Item;
    itemType?: 'attraction' | 'dining' | 'accommodation' | 'itinerary';
    variant?: 'icon' | 'full';
    className?: string;
}

export function SaveButton({ item, itemType = 'attraction', variant = 'icon', className }: SaveButtonProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if saved
    useEffect(() => {
        if (!user) {
            setIsSaved(false);
            return;
        }

        // Demo Mode Check
        if (user.uid === 'demo-user-123') {
            // Mock initial state (randomly saved for demo feel, or check local storage if we wanted to be fancy)
            // For now, let's just default to false for demo unless we want to persist it in memory
            return;
        }

        if (!firestore) return;

        const docRef = doc(firestore, `users/${user.uid}/saved/${item.id}`);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            setIsSaved(doc.exists());
        });

        return () => unsubscribe();
    }, [user, firestore, item.id]);

    const toggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to save items to your profile.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Demo Mode Handling
        if (user.uid === 'demo-user-123') {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsSaved(!isSaved);
            toast({
                title: !isSaved ? "Saved (Demo)" : "Removed (Demo)",
                description: !isSaved ? "Item saved to your demo profile." : "Item removed from your demo profile.",
            });
            setIsLoading(false);
            return;
        }

        if (!firestore) {
            setIsLoading(false);
            return;
        }

        try {
            const docRef = doc(firestore, `users/${user.uid}/saved/${item.id}`);
            if (isSaved) {
                await deleteDoc(docRef);
                toast({
                    title: "Removed",
                    description: "Item removed from your saved list.",
                });
            } else {
                await setDoc(docRef, {
                    id: item.id,
                    name: item.name,
                    district: item.district || 'Kerala',
                    type: itemType.toUpperCase(),
                    addedAt: new Date().toISOString(),
                    // Store minimal data needed for dashboard
                });
                toast({
                    title: "Saved!",
                    description: "Item saved to your profile.",
                });
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            toast({
                title: "Error",
                description: "Failed to update saved items.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'full') {
        return (
            <Button
                variant={isSaved ? "secondary" : "outline"}
                onClick={toggleSave}
                disabled={isLoading}
                className={cn("gap-2", className)}
            >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current text-red-500")} />
                {isSaved ? "Saved" : "Save"}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 text-white",
                isSaved && "text-red-500 hover:text-red-600 bg-white/90 hover:bg-white",
                className
            )}
            onClick={toggleSave}
            disabled={isLoading}
        >
            <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </Button>
    );
}
