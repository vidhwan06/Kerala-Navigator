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
function ItineraryDisplay({ itinerary }: { itinerary: any[] }) {
  if (!itinerary || !Array.isArray(itinerary)) return null;

  const getActivityBadge = (type: string) => {
    // Basic mapping based on keywords if we wanted to infer type, but for now we'll just check descriptions or use generic info
    return { icon: Info, className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' };
  };

  const getBadgesForDay = (day: any) => {
    // Helper to create activity items from the structured fields
    const items = [];
    if (day.morning) items.push({ time: 'Morning', description: day.morning, icon: 'sun' });
    if (day.afternoon) items.push({ time: 'Afternoon', description: day.afternoon, icon: 'sun' });
    if (day.evening) items.push({ time: 'Evening', description: day.evening, icon: 'moon' });
    return items;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 pb-2">
        <div className="p-1.5 bg-primary rounded-md">
          <Calendar className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="font-bold text-lg">{itinerary.length}-Day Itinerary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itinerary.map((day, index) => (
          <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {day.day}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{day.title}</div>
                    <div className="text-xs opacity-80">{day.travelTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-3 space-y-3">
              <div className="space-y-2">
                {/* Morning */}
                <div className="flex gap-2">
                  <div className="shrink-0 pt-0.5"><div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="h-3 w-3" /></div></div>
                  <div><span className="text-xs font-bold text-primary block uppercase tracking-wide">Morning</span><p className="text-xs text-foreground/90">{day.morning}</p></div>
                </div>
                {/* Afternoon */}
                <div className="flex gap-2">
                  <div className="shrink-0 pt-0.5"><div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="h-3 w-3" /></div></div>
                  <div><span className="text-xs font-bold text-primary block uppercase tracking-wide">Afternoon</span><p className="text-xs text-foreground/90">{day.afternoon}</p></div>
                </div>
                {/* Evening */}
                <div className="flex gap-2">
                  <div className="shrink-0 pt-0.5"><div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Clock className="h-3 w-3" /></div></div>
                  <div><span className="text-xs font-bold text-primary block uppercase tracking-wide">Evening</span><p className="text-xs text-foreground/90">{day.evening}</p></div>
                </div>
              </div>

              {/* Food */}
              {day.food && day.food.length > 0 && (
                <div className="bg-orange-50/50 p-2 rounded border border-orange-100">
                  <div className="flex items-center gap-1.5 mb-1 text-orange-700">
                    <Utensils className="h-3 w-3" />
                    <span className="text-xs font-bold uppercase">Food & Dining</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {day.food.map((f: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white border border-orange-200 px-1.5 py-0.5 rounded text-orange-800">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {day.tips && day.tips.length > 0 && (
                <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-1 text-blue-700">
                    <Info className="h-3 w-3" />
                    <span className="text-xs font-bold uppercase">Tips</span>
                  </div>
                  <ul className="list-disc list-inside text-[10px] text-blue-800/90">
                    {day.tips.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
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
  const [itinerary, setItinerary] = useState<any[] | null>(null);
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

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate itinerary');
      }

      if (result.itinerary) {
        setItinerary(result.itinerary);
        setItineraryTitle(`${values.locations} - ${values.duration} days`);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
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
        content: JSON.stringify(itinerary), // Save structured JSON as string for now, or update Firestore schema
        createdAt: new Date().toISOString(),
        isStructured: true
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
                      <ItineraryDisplay itinerary={itinerary} />
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
