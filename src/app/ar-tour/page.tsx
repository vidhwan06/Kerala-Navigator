import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArIcon } from '@/components/icons/ArIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, History, Box, Play, Scan } from 'lucide-react';

export default function ArTourPage() {
  const arImage = PlaceHolderImages.find(p => p.id === 'ar-tour-view');

  const features = [
    {
      icon: History,
      title: "Time Travel",
      description: "See historical sites as they looked centuries ago."
    },
    {
      icon: Box,
      title: "3D Artifacts",
      description: "Examine museum artifacts in 3D right on your phone."
    },
    {
      icon: Smartphone,
      title: "Interactive Guides",
      description: "Virtual guides sharing stories as you explore."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Augmented Reality Tours"
        subtitle="Experience Kerala's history and culture like never before."
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual */}
          <div className="order-2 lg:order-1 relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 group">
            {arImage && (
              <>
                <Image
                  src={arImage.imageUrl}
                  alt={arImage.description}
                  fill
                  className="object-cover transition-transform duration-[20s] scale-100 group-hover:scale-110"
                  data-ai-hint={arImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>

                {/* AR Overlay Mockup */}
                <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/20 animate-pulse">
                  <Scan className="h-6 w-6 text-accent" />
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-white font-bold text-lg">Padmanabhaswamy Temple</h3>
                    <p className="text-white/80 text-sm">Built in 8th Century AD • Dravidian Style</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="order-1 lg:order-2 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium">
              <ArIcon className="h-4 w-4" />
              <span>Beta Access Soon</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
              History Comes Alive <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Right Before Your Eyes
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Point your camera at landmarks to reveal hidden stories, reconstruct ancient ruins, and interact with virtual cultural guides. It's not just sightseeing; it's time travel.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-muted/50 border-none shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="p-2 bg-background rounded-full shadow-sm text-accent">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-accent hover:bg-accent/90 text-accent-foreground">
                <Smartphone className="mr-2 h-4 w-4" />
                Join Waitlist
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
