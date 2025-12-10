'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/firebase/provider';

export function HeroActions() {
    const { user, isUserLoading } = useUser();

    // Show default state while loading to prevent layout shift, or a skeleton
    // Here we'll just default to the "Plan Your Trip" view which is safe
    const isLoggedIn = !isUserLoading && !!user;

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            {isLoggedIn ? (
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg" size="lg">
                    <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Go to Dashboard
                    </Link>
                </Button>
            ) : (
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg" size="lg">
                    <Link href="/itinerary-planner">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Plan Your Trip
                    </Link>
                </Button>
            )}

            <Button asChild variant="outline" className="border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 text-lg px-8 py-6 rounded-full" size="lg">
                <Link href="/attractions">
                    Explore Places
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
    );
}
