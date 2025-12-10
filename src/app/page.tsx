import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  Compass,
  Camera,
  Coffee,
  Palmtree,
  Mountain,
  Waves,
  Music,
  Utensils
} from 'lucide-react';

import { AttractionIcon } from '@/components/icons/AttractionIcon';
import { ItineraryIcon } from '@/components/icons/ItineraryIcon';
import { MapIcon } from '@/components/icons/MapIcon';
import { HotelIcon } from '@/components/icons/HotelIcon';
import { DiningIcon } from '@/components/icons/DiningIcon';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { attractions, districts } from '@/lib/data';
import { InfoCard } from '@/components/shared/InfoCard';

const features = [
  {
    icon: <AttractionIcon />,
    title: 'Attraction Discovery',
    description: "Explore Kerala's top tourist spots, from serene backwaters to historic forts.",
    link: '/attractions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <ItineraryIcon />,
    title: 'Personalized Itineraries',
    description: 'Let our AI craft a custom trip plan based on your interests and duration.',
    link: '/itinerary-planner',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: <MapIcon />,
    title: 'Smart Navigation',
    description: 'Find your way with integrated maps, directions, and points of interest.',
    link: '/navigation',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: <HotelIcon />,
    title: 'Accommodation Guide',
    description: 'Discover the best hotels and homestays for a comfortable stay.',
    link: '/accommodations',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: <DiningIcon />,
    title: 'Dining Guide',
    description: 'Savor authentic Kerala cuisine with our curated list of eateries.',
    link: '/dining',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const stats = [
  { value: `${attractions.length}+`, label: 'Attractions', icon: MapPin },
  { value: `${districts.length}`, label: 'Districts', icon: Star },
  { value: 'AI', label: 'Powered', icon: Sparkles },
];

const experiences = [
  {
    title: "Serene Backwaters",
    description: "Drift through the emerald canals of Alleppey and Kumarakom.",
    icon: Waves,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    link: "/attractions?category=Backwater",
    image: PlaceHolderImages.find(p => p.id === 'attraction-alleppey-backwaters')?.imageUrl || "https://images.unsplash.com/photo-1593651187133-e5b3c3e879a8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Misty Hill Stations",
    description: "Escape to the cool tea plantations of Munnar and Wayanad.",
    icon: Mountain,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: "/attractions?category=Hill%20Station",
    image: PlaceHolderImages.find(p => p.id === 'attraction-munnar-2')?.imageUrl
  },
  {
    title: "Pristine Beaches",
    description: "Relax on the golden sands of Kovalam and Varkala.",
    icon: Palmtree,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    link: "/attractions?category=Beach",
    image: PlaceHolderImages.find(p => p.id === 'attraction-kovalam-beach')?.imageUrl
  },
  {
    title: "Rich Culture",
    description: "Witness Theyyam, Kathakali, and ancient temple festivals.",
    icon: Music,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "/attractions?category=Heritage",
    image: PlaceHolderImages.find(p => p.id === 'attraction-muthappan-temple')?.imageUrl
  }
];

import { TrendingCarousel } from '@/components/home/TrendingCarousel';
import { HeroActions } from '@/components/home/HeroActions';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-kerala-backwaters');

  // Select a few trending attractions
  const trendingAttractions = attractions.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Enhanced Hero Section */}
      {/* 1. Modern Split Hero Section */}
      <section className="relative min-h-[90vh] w-full grid lg:grid-cols-2 overflow-hidden">

        {/* Left Column: Content */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-0 order-2 lg:order-1 bg-background/50 backdrop-blur-sm">
          {/* Floating decorative elements for left side */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-[80px] animate-pulse -z-10" />

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">


            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-headline font-bold text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 tracking-tight leading-[1.1]">
              Discover the <br /> Soul of
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Kerala
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              Your personal guide to the breathtaking landscapes, vibrant culture, and hidden gems of <span className="font-semibold text-foreground">"God's Own Country"</span>.
            </p>

            {/* CTA Buttons */}
            <HeroActions />

            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-accent" />
                    <span className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="relative h-[50vh] lg:h-auto order-1 lg:order-2 overflow-hidden rounded-b-[3rem] lg:rounded-none lg:rounded-bl-[5rem] shadow-2xl lg:shadow-none z-0 group">
          {heroImage && (
            <>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover animate-in zoom-in duration-[20s]"
                priority
                data-ai-hint={heroImage.imageHint}
              />
              {/* Gradient Blending for seamless integration */}
              <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10 hidden lg:block" />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent z-10 lg:hidden" />

              {/* Subtle overlay to harmonize colors */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </>
          )}

          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse hidden lg:block" />
        </div>
      </section>

      {/* 2. Quick Filters & Trending Carousel */}
      <section className="w-full py-12 bg-background">
        <div className="container mx-auto px-4">

          {/* Quick Filters */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-center md:text-left">Explore by Interest</h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {['Beaches', 'Backwaters', 'Hill Stations', 'Wildlife', 'Heritage', 'Food', 'Ayurveda', 'Adventure'].map((filter) => (
                <Button key={filter} variant="outline" className="rounded-full border-2 hover:border-primary hover:text-primary transition-all">
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">Most loved destinations by travelers this week</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex group">
              <Link href="/attractions">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Carousel */}
          <TrendingCarousel attractions={trendingAttractions} />

          <Button variant="outline" asChild className="w-full md:hidden mt-8">
            <Link href="/attractions">View All Attractions</Link>
          </Button>
        </div>
      </section>

      {/* 3. Experience Kerala Section */}
      <section className="w-full py-24 bg-muted/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Discover</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Experience Kerala</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From the misty hills to the serene backwaters, find the perfect vibe for your next adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <Link href={exp.link} key={index} className="block h-full">
                  <div
                    className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <Image
                      src={exp.image || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={exp.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className={`w-12 h-12 rounded-xl ${exp.bg} backdrop-blur-md flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                        <Icon className={`h-6 w-6 ${exp.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{exp.title}</h3>
                      <p className="text-white/80 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Features Grid Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              <span>Everything You Need</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">
              Your Ultimate <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Travel Toolkit</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              We've combined cutting-edge AI with local expertise to create the perfect travel companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <CardHeader className="relative pb-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg w-fit`}>
                    <div className="w-8 h-8 text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed mb-8">
                    {feature.description}
                  </CardDescription>

                  <Button
                    asChild
                    variant="ghost"
                    className="group/btn p-0 h-auto text-primary hover:text-primary/80 font-semibold text-lg"
                  >
                    <Link href={feature.link} className="flex items-center gap-2">
                      <span>Explore Feature</span>
                      <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* 6. Final CTA Section */}
      <section className="w-full py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create your personalized itinerary in seconds with our AI planner. No more hours of research—just pure exploration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-12 py-8 rounded-full shadow-2xl hover:shadow-xl hover:-translate-y-1 transition-all">
              <Link href="/itinerary-planner">
                <Sparkles className="mr-2 h-6 w-6" />
                Plan My Trip Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10 text-lg px-12 py-8 rounded-full">
              <Link href="/attractions">
                Browse Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
