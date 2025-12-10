'use client';

import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Map, Navigation, WifiOff, Bus, Bell } from 'lucide-react';
import { attractions } from '@/lib/data';

// Dynamically import LeafletMap with no SSR to avoid window is not defined error
const LeafletMap = dynamic(() => import('@/components/shared/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">
      Loading Map...
    </div>
  ),
});

export default function NavigationPage() {
  const features = [
    {
      icon: WifiOff,
      title: "Offline Maps",
      description: "Download maps for remote areas like Wayanad and Idukki."
    },
    {
      icon: Bus,
      title: "Public Transport",
      description: "Real-time bus and train schedules across Kerala."
    },
    {
      icon: Navigation,
      title: "Turn-by-Turn",
      description: "Voice-guided navigation in English and Malayalam."
    }
  ];

  // Kerala Coordinates (approx center)
  const keralaPosition: [number, number] = [10.8505, 76.2711];

  const markers = attractions
    .filter(a => a.lat && a.lng)
    .map(a => ({
      position: [a.lat!, a.lng!] as [number, number],
      title: a.name,
      description: a.location
    }));

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Smart Navigation"
        subtitle="Your intelligent guide to exploring God's Own Country."
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Map className="h-4 w-4" />
              <span>Interactive Map</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
              Never Get Lost in <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Paradise
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore Kerala with our interactive map. Find top attractions, hidden gems, and plan your route effortlessly.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-muted/50 border-none shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="p-2 bg-background rounded-full shadow-sm text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <Bell className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">
                View Full Map
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 group bg-muted">
            <LeafletMap position={keralaPosition} zoom={7} markers={markers} />
          </div>
        </div>
      </div>
    </div>
  );
}
