'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createItinerary } from './actions';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Wand2, Save } from 'lucide-react';
import { ItineraryIcon } from '@/components/icons/ItineraryIcon';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SavedItineraryIcon } from '@/components/icons/SavedItineraryIcon';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Calendar,
  Clock,
  Utensils,
  Hotel,
  Camera,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Heart
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';

// Compact Vertical Timeline Itinerary Display
function ItineraryDisplay({ content }: { content: string }) {
  // Parse the itinerary content into structured data
  const parseItinerary = (text: string) => {
    const lines = text.split('\n');
    const days: Array<{
      day: number;
      title: string;
      activities: Array<{ time?: string; description: string; icon: any; type: string }>;
    }> = [];

    let currentDay: any = null;
    let inOverview = true;
    let overview = '';

    for (const line of lines) {
      const trimmed = line.trim();

      // Improved regex to handle various "Day X" formats (e.g., "## Day 1", "**Day 1**", "Day 1 - Title")
      const dayMatch = trimmed.match(/^(?:##\s*)?(?:\*\*)?Day (\d+)[:\s]*(?:-)?\s*(.*?)(?:\*\*)?$/i);

      if (dayMatch) {
        if (currentDay) days.push(currentDay);
        inOverview = false;
        currentDay = {
          day: parseInt(dayMatch[1] || '1'),
          title: (dayMatch[2] || '').trim() || `Day ${dayMatch[1] || '1'}`,
          activities: []
        };
      } else if (currentDay && trimmed) {
        const timeMatch = trimmed.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*[-:]\s*(.+)$/);

        let icon = Info;
        let description = trimmed;
        let time = undefined;
        let type = 'general';

        if (timeMatch) {
          time = timeMatch[1] || undefined;
          description = timeMatch[2] || trimmed;
        }

        if (description.toLowerCase().includes('breakfast') ||
          description.toLowerCase().includes('lunch') ||
          description.toLowerCase().includes('dinner') ||
          description.toLowerCase().includes('meal')) {
          icon = Utensils;
          type = 'meal';
        } else if (description.toLowerCase().includes('hotel') ||
          description.toLowerCase().includes('check-in') ||
          description.toLowerCase().includes('accommodation') ||
          description.toLowerCase().includes('resort')) {
          icon = Hotel;
          type = 'accommodation';
        } else if (description.toLowerCase().includes('visit') ||
          description.toLowerCase().includes('explore') ||
          description.toLowerCase().includes('tour') ||
          description.toLowerCase().includes('see') ||
          description.toLowerCase().includes('view')) {
          icon = Camera;
          type = 'sightseeing';
        } else if (description.toLowerCase().includes('drive') ||
          description.toLowerCase().includes('travel') ||
          description.toLowerCase().includes('depart') ||
          description.toLowerCase().includes('arrive')) {
          icon = MapPin;
          type = 'travel';
        }

        description = description.replace(/\*\*/g, '').replace(/\*/g, '');
        currentDay.activities.push({ time, description, icon, type });
      } else if (inOverview && trimmed) {
        overview += line + '\n';
      }
    }

    if (currentDay) days.push(currentDay);
    return { overview: overview.trim(), days };
  };

  const { overview, days } = parseItinerary(content);

  const getActivityBadge = (type: string) => {
    const badges = {
      meal: { icon: Utensils, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
      accommodation: { icon: Hotel, className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
      sightseeing: { icon: Camera, className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      travel: { icon: MapPin, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      general: { icon: Info, className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' }
    };
    return badges[type as keyof typeof badges] || badges.general;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Compact Overview */}
      {overview && (
        <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-sm mb-1">Overview</h3>
              <div className="prose prose-sm max-w-none text-xs text-muted-foreground leading-relaxed">
                <ReactMarkdown>
                  {overview}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Header */}
      {days.length > 0 && (
        <div className="flex items-center gap-2 pb-2">
          <div className="p-1.5 bg-primary rounded-md">
            <Calendar className="h-4 w-4 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg">{days.length}-Day Itinerary</h3>
        </div>
      )}

      {/* Vertical Timeline Grid - All Days Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day, dayIndex) => (
          <Card key={dayIndex} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            {/* Day Header - Compact */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {day.day}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{day.title}</div>
                    <div className="text-xs opacity-80">{day.activities.length} activities</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Timeline - Compact */}
            <CardContent className="p-3 space-y-2">
              {day.activities.map((activity, actIndex) => {
                const badge = getActivityBadge(activity.type);
                const BadgeIcon = badge.icon;
                return (
                  <div key={actIndex} className="flex gap-2 group/item hover:bg-accent/50 -mx-1 px-1 py-1.5 rounded transition-colors">
                    {/* Icon */}
                    <div className="shrink-0 pt-0.5">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${badge.className}`}>
                        <BadgeIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {activity.time && (
                        <div className="flex items-center gap-1 text-xs font-medium text-primary mb-0.5">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      )}
                      <p className="text-xs leading-relaxed text-foreground/90 line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fallback */}
      {days.length === 0 && !overview && (
        <div className="text-sm whitespace-pre-wrap bg-card border rounded-lg p-4">
          {content}
        </div>
      )}
    </div>
  );
}

const formSchema = z.object({
  interests: z.string().min(3, 'Please tell us at least one interest.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day.').max(30, 'Duration cannot exceed 30 days.'),
  locations: z.string().min(3, 'Please suggest at least one location.'),
  travelStyle: z.string().optional(),
  budget: z.string().optional(),
  accommodationType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

import { cn } from '@/lib/utils';

function SavedPlacesList({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const savedQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users', userId, 'saved');
  }, [firestore, userId]);

  const { data: savedPlaces } = useCollection(savedQuery);

  if (!savedPlaces?.length) {
    return <p className="text-sm text-muted-foreground italic">No saved places yet.</p>;
  }

  return (
    <div className="space-y-3">
      {savedPlaces.map((place) => (
        <div key={place.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden relative shrink-0">
            {/* Placeholder for image, or use place.imageUrl if available */}
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {place.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium line-clamp-1">{place.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{place.location || 'Kerala'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ItineraryPlannerPage() {
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [itineraryTitle, setItineraryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { user } = useUser();
  const firestore = useFirestore();

  const userItinerariesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'itineraries');
  }, [firestore, user]);

  const { data: savedItineraries } = useCollection(userItinerariesQuery);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      interests: '',
      duration: 7,
      locations: '',
      travelStyle: 'Balanced',
      budget: 'Mid-range',
      accommodationType: 'Hotels'
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    const result = await createItinerary(values);

    if (result.success && result.itinerary) {
      setItinerary(result.itinerary);
      setItineraryTitle(`${values.locations} - ${values.duration} days`);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  async function handleSaveItinerary() {
    if (!itinerary || !user || !firestore) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save an itinerary.",
      });
      return;
    };

    try {
      const itineraryData = {
        name: itineraryTitle,
        content: itinerary,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(firestore, 'users', user.uid, 'itineraries'), itineraryData);

      toast({
        title: "Itinerary Saved!",
        description: "Your new itinerary has been saved to your account.",
      });
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your itinerary. Please try again.",
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="Personalized Itinerary Planner"
        subtitle="Let our AI craft the perfect Kerala adventure just for you. Tell us your dreams, we'll map the journey."
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Saved Places Sidebar */}
          {user && !user.isAnonymous && (
            <aside className="w-full lg:w-1/4 space-y-6 lg:order-2 h-fit lg:sticky lg:top-24">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                    Saved Places
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reference these spots for your trip:
                  </p>
                  <SavedPlacesList userId={user.uid} />
                </CardContent>
              </Card>
            </aside>
          )}

          <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-12 lg:order-1", user && !user.isAnonymous ? "lg:w-3/4" : "w-full")}>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Create Your Dream Trip</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Interests</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., beaches, backwaters, history, food" {...field} />
                            </FormControl>
                            <FormDescription>
                              Separate different interests with a comma.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trip Duration (in days)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your budget" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Budget">Budget</SelectItem>
                                  <SelectItem value="Mid-range">Mid-range</SelectItem>
                                  <SelectItem value="Luxury">Luxury</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="locations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Locations</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Kochi, Munnar, Alleppey" {...field} />
                            </FormControl>
                            <FormDescription>
                              Suggest some places you'd like to visit.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="travelStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Travel Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your travel style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                                  <SelectItem value="Balanced">Balanced</SelectItem>
                                  <SelectItem value="Adventurous">Adventurous</SelectItem>
                                  <SelectItem value="Cultural">Cultural</SelectItem>
                                  <SelectItem value="Family-Friendly">Family-Friendly</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accommodationType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accommodation Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select accommodation type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Hotels">Hotels</SelectItem>
                                  <SelectItem value="Resorts">Resorts</SelectItem>
                                  <SelectItem value="Homestays">Homestays</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Itinerary
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline text-2xl font-bold">Your Custom Itinerary</h2>
                  {itinerary && user && !user.isAnonymous && (
                    <Button onClick={handleSaveItinerary}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Itinerary
                    </Button>
                  )}
                </div>
                <Card className="min-h-[400px]">
                  <CardContent className="p-6">
                    {isLoading && (
                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Crafting your personalized journey...</p>
                      </div>
                    )}
                    {error && (
                      <div className="flex items-center justify-center h-full min-h-[300px] text-center text-destructive">
                        <p>Error: {error}</p>
                      </div>
                    )}
                    {itinerary && (
                      <ItineraryDisplay content={itinerary} />
                    )}
                    {!isLoading && !itinerary && !error && (
                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <ItineraryIcon />
                        <p className="mt-4 text-muted-foreground">Your generated itinerary will appear here.</p>
                        {user?.isAnonymous && (
                          <p className="mt-2 text-sm text-muted-foreground">Log in to save your itineraries!</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {user && !user.isAnonymous && savedItineraries && (
                <div className="space-y-4">
                  <h2 className="font-headline text-2xl font-bold">Your Saved Itineraries</h2>
                  {savedItineraries.length > 0 ? (
                    <div className="space-y-4">
                      {savedItineraries.map((savedIt) => (
                        <Card key={savedIt.id}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <SavedItineraryIcon />
                              {savedIt.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">{savedIt.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="min-h-[100px]">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                        <p className="text-muted-foreground">You have no saved itineraries yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
